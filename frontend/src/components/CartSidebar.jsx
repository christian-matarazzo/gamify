import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/CartSidebar.css";

export default function CartSidebar({ isOpen, onClose }) {
    const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();

    const totalQty = cart.reduce((t, i) => t + (parseInt(i.quantity) || 0), 0);

    const total = cart
        .reduce((sum, item) => {
            const price = parseFloat(item.discounted_price ?? item.base_price) || 0;
            const qty = parseInt(item.quantity) || 0;
            return sum + (price * qty);
        }, 0)
        .toFixed(2);

    return (
        <>
            <div
                className={`cart-sidebar-overlay ${isOpen ? "active" : ""}`}
                onClick={onClose}
            />

            <aside className={`cart-sidebar ${isOpen ? "open" : ""}`}>
                <div className="cart-sidebar-header">
                    <h2 className="cart-sidebar-title">
                        <i className="bi bi-bag-check"></i>
                        YOUR CART
                        {cart.length > 0 && (
                            <span className="cart-sidebar-count">{totalQty}</span>
                        )}
                    </h2>
                    <button className="icon-btn cart-sidebar-close" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="cart-sidebar-body">
                    {cart.length === 0 ? (
                        <div className="cart-sidebar-empty">
                            <i className="bi bi-cart-x"></i>
                            <p>YOUR CART IS EMPTY!</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="cart-sidebar-item">
                                <div className="cart-sidebar-item-info">
                                    <p className="cart-sidebar-item-title">{item.title}</p>
                                    <p className="cart-sidebar-item-price">
                                        €{(Number(item.discounted_price ?? item.base_price) * item.quantity).toFixed(2)}
                                    </p>
                                </div>

                                <div className="cart-sidebar-item-actions">
                                    <div className="cart-sidebar-qty-controls">
                                        <button
                                            className="icon-btn qty-btn btn-minus"
                                            onClick={() => decreaseQuantity(item.id)}
                                            aria-label="Minus"
                                        >
                                            <i className="bi bi-dash"></i>
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button
                                            className="icon-btn qty-btn btn-plus"
                                            onClick={() => addToCart(item)}
                                            disabled={item.quantity >= item.stock}
                                            aria-label="Plus"
                                        >
                                            <i className="bi bi-plus"></i>
                                        </button>
                                    </div>
                                    <button
                                        className="icon-btn cart-sidebar-item-remove"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-sidebar-footer">
                        <div className="cart-sidebar-total">
                            <span className="cart-sidebar-total-label">Total</span>
                            <span className="cart-sidebar-total-price">
                                <small>€</small>{total}
                            </span>
                        </div>
                        <div className="cart-sidebar-footer-buttons">
                            <Link to="/cart" className="cart-sidebar-btn cart-sidebar-btn--primary" onClick={onClose}>
                                Go to Cart Page<i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}