import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from "../context/CartContext";
import { useWish } from "../context/WishlistContext";
import "../styles/GameDetail.css";

const GameDetail = () => {
    const { slug } = useParams();
    const [game, setGame] = useState(null);
    const [gameKeys, setGameKeys] = useState(null);
    const [error, setError] = useState(null);

    const { addToCart, removeFromCart, decreaseQuantity, cart } = useCart();
    const { wish, handleWish } = useWish();

    const cartItem = cart.find(item => item.id === game?.id);
    const isInWishlist = wish.includes(game?.id);
    const availableKeys = gameKeys?.available_keys ?? 0;
    const isOutOfStock = cartItem
        ? cartItem.quantity >= availableKeys
        : availableKeys === 0;

    useEffect(() => {
        setError(isOutOfStock ? "Product ran out of keys!" : null);
    }, [isOutOfStock]);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/games/${slug}`)
            .then(response => setGame(response.data.results))
            .catch(() => setGame(null));
    }, [slug]);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/inventory/`)
            .then(response => {
                const inventoryGame = response.data.data.find(item => item.slug === slug);
                setGameKeys(inventoryGame);
            })
            .catch(() => setGameKeys(null));
    }, [slug]);

    const handleAddToCart = () => {
        addToCart({ ...game, stock: availableKeys });
    };

    



    if (!game) return (
        <main className="container py-4 text-center">
            <i className="bi bi-controller" style={{ fontSize: "48px", color: "var(--accent)" }}></i>
            <h2 style={{ color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Product not found
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                This game doesn't exist or has been removed.
            </p>
            <Link to="/" className="gamify-detail-back-btn mt-3">
                <i className="bi bi-arrow-left"></i> Back to Homepage
            </Link>
        </main>
    );

    return (
        <main className="container py-4">
            <div>
                <Link to="/" className="gamify-detail-back-btn">
                    <i className="bi bi-arrow-left"></i> Back to Homepage
                </Link>
                <Link to="/search" className="gamify-detail-back-btn ms-2">
                    <i className="bi bi-search"></i> Keep searching!
                </Link>
                <hr />

                <section className="row g-4">
                    <div className="col-12 col-md-6">
                        <div className="gamify-detail-cover-wrap">
                            {game.image_url && (
                                <img
                                    src={`http://localhost:3000/image/${game.image_url}`}
                                    alt={game.title}
                                    className="gamify-detail-cover-img"
                                />
                            )}
                            <button
                                className={`gamify-detail-wish-btn${isInWishlist ? ' active' : ''}`}
                                onClick={() => handleWish(game.id)}
                                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <i className={`bi bi-heart${isInWishlist ? '-fill' : ''}`}></i>
                            </button>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 d-flex gamify-detail-info-panel flex-column gap-2">
                        <h1 className="gamify-detail-title">{game.title}</h1>

                        <div className="gamify-detail-meta-group">
                            <p><strong>Developer: </strong>{game.developer_name}</p>
                            <p><strong>Genre: </strong>{game.genre}</p>
                            <p><strong>Release date:</strong> {game.release_date || 'Available'}</p>
                        </div>

                        <p className="gamify-detail-description">{game.description}</p>
                        <hr className="my-1" />

                        <div className="gamify-detail-price-section">
                            <p className="gamify-detail-price">{game.base_price}€</p>
                            <span className="gamify-detail-keys-badge">
                                <i className="bi bi-key me-1"></i>
                                {availableKeys} keys left!
                            </span>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <button
                                className="gamify-btn-sq gamify-btn-minus"
                                onClick={() => decreaseQuantity(game.id)}
                                disabled={!cartItem || cartItem.quantity === 0}
                                aria-label="Decrease quantity"
                            >
                                <i className="bi bi-dash-lg"></i>
                            </button>
                            <span className={`gamify-detail-qty-count${cartItem ? ' active' : ''}`}>
                                {cartItem ? `${cartItem.quantity} in cart` : '0 in cart'}
                            </span>
                            <button
                                className="gamify-btn-sq gamify-btn-plus"
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                aria-label="Add to cart"
                            >
                                <i className="bi bi-plus-lg"></i>
                            </button>
                            <Link
                                to="/cart"
                                className={!cartItem || cartItem.quantity === 0 ? 'pe-none' : ''}
                                onClick={e => (!cartItem || cartItem.quantity === 0) && e.preventDefault()}
                                aria-label="Go to Cart"
                            >
                                <button
                                    className="gamify-btn-add-cart"
                                    disabled={!cartItem || cartItem.quantity === 0}
                                >
                                    <i className="bi bi-cart-plus me-2"></i>
                                    Go to Cart
                                </button>
                            </Link>
                        </div>

                        {cartItem && (
                            <button
                                className="gamify-detail-remove-btn"
                                onClick={() => removeFromCart(game.id)}
                            >
                                Remove all from cart
                            </button>
                        )}

                        {error && (
                            <div className="gamify-detail-alert p-2 mb-3">
                                <i className="bi bi-exclamation-circle me-2"></i>
                                {error}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default GameDetail;