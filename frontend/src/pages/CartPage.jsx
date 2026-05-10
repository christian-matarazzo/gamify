import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
    const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();

    const total = cart.reduce(
        (sum, item) => sum + item.base_price * item.quantity,
        0
    );

    if (cart.length === 0) {
        return (
            <div className="container py-4 text-light">
                <h2>Il tuo carrello è vuoto</h2>
                <Link to="/" className="btn btn-primary mt-3">
                    Torna ai giochi
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-4 text-light">
            <h2 className="mb-4">Carrello</h2>

            <div className="row">
                <div className="col-md-8">

                    {cart.map(item => {
                        const isOutOfStock = item.quantity >= (item.stock ?? 0);

                        return (
                            <div key={item.id} className="mb-3">
                                <div className="p-3 border rounded bg-dark d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <img
                                            src={`http://localhost:3000/image/${item.image_url}`}
                                            alt={item.title}
                                            width="80"
                                            height="80"
                                            style={{ objectFit: "cover", borderRadius: "6px" }}
                                        />

                                        <div>
                                            <h5 className="mb-1">{item.title}</h5>
                                            <p className="mb-1">Prezzo: €{item.base_price}</p>

                                            <div className="d-flex align-items-center gap-2">
                                                <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => decreaseQuantity(item.id)}
                                                >
                                                    -
                                                </button>

                                                <span>{item.quantity}</span>

                                                <button
                                                    className={`btn btn-sm ${isOutOfStock ? 'btn-secondary' : 'btn-success'}`}
                                                    onClick={() => addToCart(item)}
                                                    disabled={isOutOfStock}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        Rimuovi
                                    </button>
                                </div>
                                
                                {isOutOfStock && (
                                    <div className="alert alert-danger py-2 mt-1">
                                        <i className="bi bi-exclamation-circle me-2"></i>
                                        Product ran out of keys!
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <button className="btn btn-danger mt-3" onClick={clearCart}>
                        Svuota carrello
                    </button>
                </div>

                <div className="col-md-4">
                    <div className="p-3 bg-secondary rounded">
                        <h4>Totale</h4>
                        <h3>€{total.toFixed(2)}</h3>

                        <Link to="/checkout" className="btn btn-primary w-100 mt-3">
                            Procedi al checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}