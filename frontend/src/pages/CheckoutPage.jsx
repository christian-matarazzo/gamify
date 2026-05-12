import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import "../styles/CheckoutPage.css";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [customerEmail, setCustomerEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
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

  useEffect(() => {
    const savedCart = sessionStorage.getItem('gamify_cart');

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart && parsedCart.items && Array.isArray(parsedCart.items)) {
          setCartItems(parsedCart.items);
          if (parsedCart.coupon) {
            setCouponCode(parsedCart.coupon);
          }
          if (parsedCart.discount !== undefined && parsedCart.discount !== null) {
            setDiscountAmount(Number(parsedCart.discount));
          }
        }
        else if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      } catch (error) {
        setErrorMessage("Cart can't be loaded. Retry");
      }
    }
  }, []);

  const getPriceToDisplay = function (item) {
    if (item.discounted_price !== undefined && item.discounted_price !== null) {
      return Number(item.discounted_price);
    }
    return Number(item.base_price);
  };

  const getOriginalPrice = function (item) {
    if (item.discounted_price !== undefined && item.discounted_price !== null) {
      return Number(item.base_price);
    }
    return null;
  };

  const handlePurchase = async function (event) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const stockCheck = await checkStockAvailability(cartItems);

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
        items: cartItems.map(function (item) {
          return {
            game_id: item.id,
            quantity: item.quantity || 1
          };
        }),
        coupon: couponCode.trim() || null
      });

      if (response.data.success) {
        setOrderResult(response.data);
        clearCart(); 
        setCouponCode('');
        setDiscountAmount(0);
      }
    } catch (purchaseError) {
      setErrorMessage(purchaseError.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
              clearCart();
              navigate('/', { replace: true });
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleRemoveItem = function (itemId) {
    const updatedCartItems = cartItems.filter(function (item) {
      return item.id !== itemId;
    });
    setCartItems(updatedCartItems);
    const newTotal = updatedCartItems.reduce(function (sum, item) {
      const price = getPriceToDisplay(item);
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
    const cartData = {
      items: updatedCartItems,
      coupon: couponCode.trim() || null,
      discount: discountAmount,
      finalTotal: newTotal
    };
    sessionStorage.setItem('gamify_cart', JSON.stringify(cartData));
  };

  const handleResetCheckout = function () {
    const isConfirmed = window.confirm("Are you sure to cancel the order?");
    if (!isConfirmed) return;
    setCartItems([]);
    setCustomerEmail('');
    setCouponCode('');
    setDiscountAmount(0);
    setBillingName('');
    setBillingAddress('');
    setBillingCity('');
    setBillingZip('');
    setBillingCountry('IT');
    setBillingVat('');
    setOrderResult(null);
    setErrorMessage('');
    setIsLoading(false);
    sessionStorage.removeItem('gamify_cart');
    sessionStorage.removeItem('gamify_billing');
    window.location.href = '/';
  };

  const calculatedTotal = cartItems.reduce(function (sum, item) {
    const price = getPriceToDisplay(item);
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);

  const originalTotal = cartItems.reduce(function (sum, item) {
    const quantity = item.quantity || 1;
    return sum + (item.base_price * quantity);
  }, 0);
  const totalSavings = originalTotal - calculatedTotal;

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

  return (
    <div className="container py-4">
      <h2 className="gamify-cart-heading mb-4">
        <span>Secure</span> Checkout
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-cart-x gamify-cart-empty-icon"></i>
          <p className="gamify-cart-empty-title">Your cart is empty</p>
          <Link to="/" className="gamify-btn-primary">Continue shopping</Link>
        </div>
      ) : (
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
                {cartItems.map(function (item) {
                  const displayPrice = getPriceToDisplay(item);
                  const originalPrice = getOriginalPrice(item);
                  const quantity = item.quantity || 1;

                  return (
                    <div key={item.id} className="gamify-checkout-item-row">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="min-w-0">
                          <div className="gamify-item-title-sm">{item.title}</div>
                          <div className="gamify-summary-text">Qty: {quantity}</div>
                        </div>
                        <div className="text-end">
                          {originalPrice !== null && (
                            <div className="text-decoration-line-through text-muted small">€{originalPrice.toFixed(2)}</div>
                          )}
                          <div className="text-white fw-bold">€{displayPrice.toFixed(2)}</div>
                        </div>
                        <button
                          type="button"
                          className="gamify-cart-remove ms-2"
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
                <span className="gamify-summary-text">€{originalTotal.toFixed(2)}</span>
              </div>

              {totalSavings > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="gamify-summary-text">Total Savings</span>
                  <span className="gamify-summary-free">- €{totalSavings.toFixed(2)}</span>
                </div>
              )}

              <hr className="gamify-summary-divider" />

              <div className="d-flex justify-content-between align-items-center">
                <span className="gamify-summary-total-label">Total to Pay</span>
                <span className="gamify-summary-total-price">€{calculatedTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}