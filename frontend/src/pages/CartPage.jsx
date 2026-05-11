import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/CartPage.css";

export default function CartPage() {
    const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate()
    const [promoCode, setPromoCode] = useState("");

    const total = cart.reduce(
        (sum, item) => sum + item.base_price * item.quantity,
        0
    );

    const handleProceedToCheckout = () => {
        localStorage.setItem('gamify_cart', JSON.stringify(cart));
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="container py-5 text-center">
                <i className="bi bi-cart-x gamify-cart-empty-icon"></i>
                <h2 className="gamify-cart-empty-title">Your cart is empty</h2>
                <p className="gamify-cart-empty-sub">Add some games to get started</p>
                <Link to="/" className="gamify-btn-primary">
                    Back to homepage
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h2 className="gamify-cart-heading mb-4">
                <span>Your</span> Cart
            </h2>

            <div className="row g-4 align-items-start">
                <div className="col-12 col-md-8">
                    <div className="d-flex flex-column gap-3">
                        {cart.map(item => {
                            const isOutOfStock = item.quantity >= (item.stock ?? 0);
                            const imageUrl = `http://localhost:3000/image/${item.image_url}`;

                            return (
                                <div key={item.id}>
                                    <div className={`gamify-cart-item ${isOutOfStock ? "gamify-cart-item-stock" : ""}`}>
                                        <div className="gamify-cart-item-img-wrap">
                                            <img
                                                src={imageUrl}
                                                alt={item.title}
                                                className="gamify-cart-item-img"
                                            />
                                        </div>

                                        <div className="flex-grow-1 min-w-0">
                                            <h5 className="gamify-cart-item-title">{item.title}</h5>
                                            <p className="gamify-cart-item-price">€{item.base_price}</p>

                                            <div className="d-flex align-items-center gap-2">
                                                <button
                                                    className={`gamify-qty-btn ${item.quantity <= 1 ? "gamify-qty-btn--disabled" : ""}`}
                                                    onClick={() => decreaseQuantity(item.id)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className="gamify-qty-value">{item.quantity}</span>
                                                <button
                                                    className={`gamify-qty-btn ${isOutOfStock ? "gamify-qty-btn--disabled" : "gamify-qty-btn--add"}`}
                                                    onClick={() => addToCart(item)}
                                                    disabled={isOutOfStock}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            className="gamify-cart-remove ms-2"
                                            onClick={() => removeFromCart(item.id)}
                                            title="Remove from cart"
                                        >
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </div>

                                    {isOutOfStock && (
                                        <div className="gamify-stock-badge mt-1">
                                            <i className="bi bi-exclamation-circle me-2"></i>
                                            No more keys available for this product!
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <button className="gamify-btn-clear mt-2" onClick={clearCart}>
                            <i className="bi bi-trash3 me-2"></i>
                            Clear cart
                        </button>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="gamify-cart-summary sticky-md-top">
                        <h4 className="gamify-summary-label">Order summary</h4>

                        <div className="d-flex justify-content-between mb-2">
                            <span className="gamify-summary-text">Subtotal</span>
                            <span className="gamify-summary-text">€{total.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="gamify-summary-text">Shipping fee</span>
                            <span className="gamify-summary-free">Free</span>
                        </div>

                        <hr className="gamify-summary-divider" />

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <span className="gamify-summary-total-label">Total</span>
                            <span className="gamify-summary-total-price">€{total.toFixed(2)}</span>
                        </div>

                        <div className="gamify-promo-section mb-4">
                            <label className="gamify-summary-text gamify-promo-label mb-2">
                                Have a discount code?
                            </label>

                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control gamify-promo-input"
                                    placeholder="Enter code"
                                    aria-label="Discount code"
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                                <button className="btn gamify-btn-apply" type="button">
                                    Apply
                                </button>
                            </div>
                        </div>
                        <button
                            className="gamify-btn-checkout d-block w-100 text-center"
                            onClick={handleProceedToCheckout}>
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}