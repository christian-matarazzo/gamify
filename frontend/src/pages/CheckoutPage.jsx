import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CheckoutPage() {
  const [customerEmail, setCustomerEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [orderResult, setOrderResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('gamify_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const handlePurchase = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:3000/api/orders/purchase', {
        email: customerEmail,
        items: cartItems.map(item => ({
          game_id: item.id,
          quantity: item.quantity || 1
        })),
        coupon: couponCode.trim() || null
      });

      if (response.data.success) {
        setOrderResult(response.data);
        localStorage.removeItem('gamify_cart');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  if (orderResult?.success) {
    return (
      <div className="container py-5">
        <h3>✅ Purchase Successful</h3>
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
  return (
    <div className="container py-5">
      <h2>Checkout</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <a href="/">Continue shopping</a></p>
      ) : (
        <>
          <div className="mb-3">
            <strong>Cart Items:</strong>
            {cartItems.map(item => (
              <div key={item.id} className="small">
                {item.title} — {item.base_price}€
              </div>
            ))}
          </div>

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
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Coupon code (optional)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </div>
            {errorMessage && <div className="alert alert-danger small py-2">{errorMessage}</div>}
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Complete Purchase'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}