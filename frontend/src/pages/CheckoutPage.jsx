import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CheckoutPage() {
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
    console.group('📥 CheckoutPage: useEffect - Caricamento carrello');

    const savedCart = localStorage.getItem('gamify_cart');
    console.log('Raw localStorage:', savedCart);

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('Parsed cart:', parsedCart);
        console.log('parsedCart.items esiste?', !!parsedCart.items);
        console.log('parsedCart.items è array?', Array.isArray(parsedCart.items));

        if (parsedCart && parsedCart.items && Array.isArray(parsedCart.items)) {

          setCartItems(parsedCart.items);

          if (parsedCart.coupon) {
            console.log('Coupon trovato:', parsedCart.coupon);
            setCouponCode(parsedCart.coupon);
          }
          if (parsedCart.discount !== undefined && parsedCart.discount !== null) {
            setDiscountAmount(Number(parsedCart.discount));
          }
        }
        else if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
        else {
        }
      } catch (error) {
        console.error("Errore nel parsing del carrello:", error);
        setErrorMessage("Cart can't be loaded. Retry");
      }
    } else {
    }

    console.groupEnd();
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

const handlePurchase = async function(event) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');


    const stockCheck = await checkStockAvailability(cartItems);
    
    if (!stockCheck.success) {

        if (stockCheck.unavailable && stockCheck.unavailable.length > 0) {
            const unavailableNames = stockCheck.unavailable.map(function(unavailableItem) {
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
            items: cartItems.map(function(item) {
                return {
                    game_id: item.id,
                    quantity: item.quantity || 1
                };
            }),
            coupon: couponCode.trim() || null
        });

        if (response.data.success) {
            setOrderResult(response.data);
            localStorage.removeItem('gamify_cart');
        }
    } catch (purchaseError) {
        setErrorMessage(purchaseError.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
        setIsLoading(false);
    }
};

  if (orderResult?.success) {
    return (
      <div className="container py-5">
        <h3>Purchase Successful!</h3>
        <p>Order ID: #{orderResult.order_id}</p>
        <div className="mt-3">
          <strong>Your License Keys:</strong>
          {orderResult.license_keys.map((licenseKey, index) => (
            <div key={index} className="bg-light p-2 my-2 rounded font-monospace small">
              {licenseKey}
            </div>
          ))}
        </div>
        <a href="/" className="btn btn-primary mt-3">Back to Home</a>
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

    localStorage.setItem('gamify_cart', JSON.stringify(cartData));
  };

  const handleResetCheckout = function () {
    const isConfirmed = window.confirm(
      "Are you sure to cancel the order?"
    );

    if (!isConfirmed) {
      return;
    }

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

    localStorage.removeItem('gamify_cart');
    localStorage.removeItem('gamify_billing');

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
      console.error('Errore di rete durante il controllo stock:', networkError);
      return {
        success: false,
        message: 'Unable to verify item availability. Please check your connection and try again.',
        unavailable: []
      };
    }
  };


  return (
    <div className="container py-5">
      <h2>Checkout</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <a href="/">Continue shopping</a></p>
      ) : (
        <>
          <div className="mb-3">
            <strong>Cart Items:</strong>
            {cartItems.map(function (item) {
              const displayPrice = getPriceToDisplay(item);
              const originalPrice = getOriginalPrice(item);
              const quantity = item.quantity || 1;
              const lineTotal = displayPrice * quantity;

              return (
                <div key={item.id} className="small border-bottom py-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{item.title}</strong>
                      <div>Qty: {quantity}</div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm text-danger ms-2"
                      onClick={function () { handleRemoveItem(item.id); }}
                      title="Remove this item"
                      style={{ minWidth: 'auto', padding: '0.25rem 0.5rem' }}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>

                    <div className="text-end">
                      {originalPrice !== null ? (
                        <>
                          <span className="text-decoration-line-through small me-2">
                            €{originalPrice.toFixed(2)}
                          </span>
                          <span className="text-success fw-bold">
                            €{displayPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span>€{displayPrice.toFixed(2)}</span>
                      )}
                      <div className="small">
                        Subtotal: €{lineTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DISCOUNT APPLIED */}
          {cartItems.length > 0 && (
            <div className="card bg-light mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-1">
                  <span>Subtotal (original)</span>
                  <span>€{originalTotal.toFixed(2)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="d-flex justify-content-between mb-1 text-success">
                    <span>Discount applied</span>
                    <span>- €{totalSavings.toFixed(2)}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total to pay</span>
                  <span>€{calculatedTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* BILLING INFORMATION */}
          <div className="card mb-4">
            <div className="card-header bg-white fw-bold">
              <i className="bi bi-receipt me-2"></i>
              Billing Information
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small">Full Name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Mario Rossi"
                    value={billingName}
                    onChange={function (event) { setBillingName(event.target.value); }}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small">Address</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Via Roma 123"
                    value={billingAddress}
                    onChange={function (event) { setBillingAddress(event.target.value); }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small">City</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Milano"
                    value={billingCity}
                    onChange={function (event) { setBillingCity(event.target.value); }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small">ZIP Code</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="20100"
                    value={billingZip}
                    onChange={function (event) { setBillingZip(event.target.value); }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small">Country</label>
                  <select
                    className="form-select form-select-sm"
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
                  <label className="form-label small">VAT Number (optional)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="IT12345678901"
                    value={billingVat}
                    onChange={function (event) { setBillingVat(event.target.value); }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FORM PAYOUT */}
          <form onSubmit={handlePurchase}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Your email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>
            {errorMessage && <div className="alert alert-danger small py-2">{errorMessage}</div>}
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Complete Purchase'}
            </button>
          </form>

          {cartItems.length > 0 && (
            <div className="text-center mt-4 pt-3 border-top">
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={handleResetCheckout}
              >
                <i className="bi bi-trash3 me-2"></i>
                Cancel order and remove items from cart
              </button>
              <p className="small mt-2 mb-0">
                This action can't be reverted!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}