// frontend/src/pages/CheckoutPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import "../styles/CheckoutPage.css";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  
  // --- DATI DAL CARTCONTEXT (unica fonte di verità) ---
  const { 
    cart,                    // Array di item nel carrello
    removeFromCart,          // Funzione per rimuovere item
    clearCart,               // Funzione per svuotare carrello
    couponData,              // { appliedCoupon, discountAmount: valore FISSO }
    subtotal,                // Somma base_price × qty (senza sconto)
    total,                   // subtotal - sconto applicato (mai negativo)
    getAppliedDiscount,      // Helper: restituisce sconto effettivo (cappato a subtotal)
    saveCartWithMetadata     // Persistenza esplicita se necessaria
  } = useCart();

  // --- STATO LOCALE SPECIFICO DEL CHECKOUT (non condiviso) ---
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderResult, setOrderResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  /* billing infos two way data binding (Salvatore don't remove the comment, thanks. By Cri)*/
  const [billingName, setBillingName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [billingCountry, setBillingCountry] = useState('IT');
  const [billingVat, setBillingVat] = useState('');

  // --- NOTA: couponCode e discountAmount NON servono più come stato locale ---
  // Si usano direttamente couponData.appliedCoupon e getAppliedDiscount() dal Context

  // --- Prezzo da visualizzare per item (sempre base_price, mai scontato) ---
  const getPriceToDisplay = function (item) {
    return parseFloat(item?.base_price) || 0;
  };

  // --- Rimozione item: usa la funzione del Context ---
  const handleRemoveItem = function (itemId) {
    // removeFromCart nel Context gestisce già:
    // 1. Rimozione dall'array cart
    // 2. Trigger del useEffect per aggiornare sessionStorage
    // 3. Ricalcolo automatico di subtotal/total (con sconto fisso invariato)
    removeFromCart(itemId);
  };

  const handlePurchase = async function (event) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Stock check con i dati attuali dal Context
    const stockCheck = await checkStockAvailability(cart);

    if (!stockCheck.success) {
      if (stockCheck.unavailable && stockCheck.unavailable.length > 0) {
        const unavailableNames = stockCheck.unavailable.map(function (unavailableItem) {
          if (unavailableItem.title) {
            return `"${unavailableItem.title}"`;
          }
          return `Product #${unavailableItem.game_id}`;
        });
        const userMessage = `The following item(s) are no longer available: ${unavailableNames.join(', ')}. Please remove them from your cart and try again.`;
        setErrorMessage(userMessage);
      } else {
        setErrorMessage(stockCheck.message || 'Some items are no longer available. Please refresh and try again.');
      }
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/orders/purchase', {
        email: customerEmail,
        billing: {
          name: billingName,
          address: billingAddress,
          city: billingCity,
          zip: billingZip,
          country: billingCountry,
          vat: billingVat || null
        },
        paymentMethod: paymentMethod,
        items: cart.map(function (item) {
          return {
            game_id: item.id,
            quantity: item.quantity || 1
          };
        }),
        // Usa il coupon dal Context (se presente)
        coupon: couponData.appliedCoupon?.trim() || null
      });

      if (response.data.success) {
        setOrderResult(response.data);
        // clearCart nel Context gestisce già:
        // 1. Svuotamento dell'array cart
        // 2. Reset di couponData
        // 3. Rimozione da sessionStorage
        clearCart();
      }
    } catch (purchaseError) {
      setErrorMessage(purchaseError.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetCheckout = function () {
    const isConfirmed = window.confirm("Are you sure to cancel the order?");
    if (!isConfirmed) return;
    
    // Usa clearCart dal Context per una pulizia coerente
    clearCart();
    
    // Reset dello stato locale specifico del checkout
    setCustomerEmail('');
    setBillingName('');
    setBillingAddress('');
    setBillingCity('');
    setBillingZip('');
    setBillingCountry('IT');
    setBillingVat('');
    setPaymentMethod('card');
    setOrderResult(null);
    setErrorMessage('');
    setIsLoading(false);
    
    navigate('/', { replace: true });
  };

  const checkStockAvailability = async function (items) {
    try {
      const response = await axios.post('http://localhost:3000/api/stock/check', {
        items: items.map(function (item) {
          return {
            game_id: item.id,
            quantity: item.quantity || 1
          };
        })
      });
      return response.data;
    } catch (networkError) {
      return {
        success: false,
        message: 'Unable to verify item availability. Please check your connection and try again.',
        unavailable: []
      };
    }
  };

  // --- UI: Messaggio di successo ---
  if (orderResult?.success) {
    return (
      <div className="container py-5 text-center">
        <div className="gamify-success-card">
          <i className="bi bi-check-all gamify-success-icon"></i>
          <h2 className="gamify-cart-heading mb-3"><span>Purchase</span> Successful!</h2>
          <p className="text-secondary">Order ID: <span className="text-white">#{orderResult.order_id}</span></p>

          <div className="gamify-keys-container mt-4">
            <h5 className="gamify-summary-label mb-3">Your License Keys</h5>
            {orderResult.license_keys.map((licenseKey, index) => (
              <div key={index} className="gamify-license-key">
                {licenseKey}
                <i className="bi bi-copy ms-auto" style={{ cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(licenseKey)}></i>
              </div>
            ))}
          </div>
          <button
            className="gamify-btn-primary mt-4 d-inline-block"
            onClick={() => {
              navigate('/', { replace: true });
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // --- UI: Carrello vuoto ---
  if (cart.length === 0) {
    return (
      <div className="container py-4">
        <Link to="/cart" className="gamify-detail-back-btn ms-2">
          <i className="bi bi-arrow-left"></i> Go back to Cart
        </Link>
        <hr />
        <div className="text-center py-5">
          <i className="bi bi-cart-x gamify-cart-empty-icon"></i>
          <p className="gamify-cart-empty-title">Your cart is empty</p>
          <Link to="/" className="gamify-btn-primary">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    { id: 'card', icon: 'bi-credit-card', label: 'Credit Card', sub: 'Visa / Mastercard' },
    { id: 'paypal', icon: 'bi-paypal', label: 'PayPal', sub: 'Account or guest' },
    { id: 'apple', icon: 'bi-apple', label: 'Apple Pay', sub: 'Face/Touch ID' },
  ];

  const paymentDetails = {
    card: 'Secure payment with credit or debit card. Your data is encrypted and not stored.',
    paypal: 'You will be redirected to PayPal to complete the payment. Cards are also accepted without an account.',
    apple: 'Available on Safari/iOS. Use Face ID or Touch ID to authorize the payment.'
  };

  return (
    <div className="container py-4">
      <Link to="/cart" className="gamify-detail-back-btn ms-2">
        <i className="bi bi-arrow-left"></i> Go back to Cart
      </Link>
      <hr />
      <h2 className="gamify-cart-heading mb-4">
        <span>Secure</span> Checkout
      </h2>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="gamify-checkout-section mb-4">
            <div className="gamify-checkout-title mb-4">
              <i className="bi bi-receipt me-2"></i>
              Billing Information
            </div>
            <div className="row g-3">
              <div className="col-12">
                <label className="gamify-input-label">Full Name</label>
                <input
                  type="text"
                  className="form-control gamify-promo-input"
                  placeholder="John Doe"
                  value={billingName}
                  onChange={function (event) { setBillingName(event.target.value); }}
                />
              </div>
              <div className="col-12">
                <label className="gamify-input-label">Address</label>
                <input
                  type="text"
                  className="form-control gamify-promo-input"
                  placeholder="Fifth Avenue, NYC, SID"
                  value={billingAddress}
                  onChange={function (event) { setBillingAddress(event.target.value); }}
                />
              </div>
              <div className="col-md-6">
                <label className="gamify-input-label">City</label>
                <input
                  type="text"
                  className="form-control gamify-promo-input"
                  placeholder="New York"
                  value={billingCity}
                  onChange={function (event) { setBillingCity(event.target.value); }}
                />
              </div>
              <div className="col-md-6">
                <label className="gamify-input-label">ZIP Code</label>
                <input
                  type="text"
                  className="form-control gamify-promo-input"
                  placeholder="20100"
                  value={billingZip}
                  onChange={function (event) { setBillingZip(event.target.value); }}
                />
              </div>
              <div className="col-md-6">
                <label className="gamify-input-label">Country</label>
                <select
                  className="form-select gamify-promo-input"
                  value={billingCountry}
                  onChange={function (event) { setBillingCountry(event.target.value); }}
                >
                  <option value="IT">Italy</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="ES">Spain</option>
                  <option value="UK">United Kingdom</option>
                  <option value="US">United States</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="gamify-input-label">VAT Number (optional)</label>
                <input
                  type="text"
                  className="form-control gamify-promo-input"
                  placeholder="LM12345678901"
                  value={billingVat}
                  onChange={function (event) { setBillingVat(event.target.value); }}
                />
              </div>
            </div>
          </div>
          
          <div className="gamify-checkout-section mb-4">
            <div className="gamify-checkout-title mb-3">
              <i className="bi bi-wallet2 me-2"></i>
              Payment Method
            </div>
            <div className="row g-2 mb-3">
              {paymentMethods.map(({ id, icon, label, sub }) => (
                <div className="col-6 col-sm-4" key={id}>
                  <button
                    type="button"
                    className={`gamify-pay-btn w-100 ${paymentMethod === id ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(id)}
                  >
                    <i className={`bi ${icon} gamify-pay-icon`}></i>
                    <span className="gamify-pay-label">{label}</span>
                    <span className="gamify-pay-sub">{sub}</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="gamify-pay-detail">
              <i className="bi bi-shield-check me-2"></i>
              {paymentDetails[paymentMethod]}
            </div>
          </div>
          
          <form onSubmit={handlePurchase} className="gamify-checkout-section">
            <div className="gamify-checkout-title mb-3">
              <i className="bi bi-envelope me-2"></i>
              Delivery Email
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control gamify-promo-input"
                placeholder="Where should we send your keys?"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>
            {errorMessage && (
              <div className="gamify-coupon-feedback is-error mb-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {errorMessage}
              </div>
            )}
            <button type="submit" className="gamify-btn-checkout w-100 border-0" disabled={isLoading}>
              {isLoading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
              ) : 'Complete Purchase'}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              type="button"
              className="gamify-btn-clear"
              onClick={handleResetCheckout}
            >
              <i className="bi bi-trash3 me-2"></i>
              Cancel Order
            </button>
            <p className="gamify-cart-empty-sub mt-2" style={{ fontSize: '11px' }}>
              This action can't be reverted!
            </p>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="gamify-cart-summary sticky-lg-top">
            <h4 className="gamify-summary-label">Order Review</h4>
            <div className="gamify-checkout-items mb-4">
              {cart.map(function (item) {
                const displayPrice = getPriceToDisplay(item);
                const quantity = item.quantity || 1;

                return (
                  <div className="d-flex justify-content-between align-items-center" key={item.id}>
                    <div className="min-w-0">
                      <div className="gamify-item-title-sm">{item.title}</div>
                      <div className="gamify-summary-text">Qty: {quantity}</div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <div className="text-end">
                        <div className="text-white fw-bold">
                          €{displayPrice.toFixed(2)}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="gamify-cart-remove"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="gamify-summary-text">Original Subtotal</span>
              <span className="gamify-summary-text">€{subtotal.toFixed(2)}</span>
            </div>

            {/* Mostra sconto SOLO se attivo e > 0, usando getAppliedDiscount() */}
            {couponData.appliedCoupon && getAppliedDiscount() > 0 && (
              <div className="d-flex justify-content-between mb-2">
                <span className="gamify-summary-text">
                  Coupon ({couponData.appliedCoupon})
                </span>
                <span className="gamify-summary-free">
                  - €{getAppliedDiscount().toFixed(2)}
                </span>
              </div>
            )}
            
            <hr className="gamify-summary-divider" />

            <div className="d-flex justify-content-between align-items-center">
              <span className="gamify-summary-total-label">Total to Pay</span>
              {/* total è già calcolato nel Context: subtotal - sconto applicato */}
              <span className="gamify-summary-total-price">€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}