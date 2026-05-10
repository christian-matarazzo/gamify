import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from "../context/CartContext";
import { useWish } from "../context/WishlistContext"

const GameDetail = () => {
    const { slug } = useParams();
    const [game, setGame] = useState(null);
    const { wish, handleWish } = useWish();
    const [gameKeys, setGameKeys] = useState(null)
    const [error, setError] = useState(null);

    const { addToCart, removeFromCart, decreaseQuantity, cart } = useCart();
    
    const cartItem = cart.find(item => item.id === game?.id);
    const controlWish = wish.includes(game?.id);
    
    const isOutOfStock = cartItem && gameKeys 
        ? cartItem.quantity >= gameKeys.available_keys 
        : (gameKeys?.available_keys === 0);

    useEffect(() => {
        if (isOutOfStock) {
            setError("Product ran out of keys!");
        } else {
            setError(null);
        }
    }, [isOutOfStock]);

    const handleAddToCart = () => {
        const available = gameKeys?.available_keys ?? 0;
        addToCart({ ...game, stock: available });
    };

    useEffect(() => {
        axios.get(`http://localhost:3000/api/games/${slug}`)
            .then(response => {
                setGame(response.data.results)
            })
            .catch(error => {
                setGame(null);
            });
    }, [slug]);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/inventory/`)
            .then(response => {
                const inventoryGame = response.data.data.find(item => item.slug === slug);
                setGameKeys(inventoryGame);
            })
            .catch(error => {
                setGameKeys(null);
            });
    }, [slug]);

    if (!game) return <h2>Prodotto non trovato</h2>;

    return (
        <main className="container py-4">
            <div>
                <Link to="/">← Torna alla lista</Link>
                <hr />

                {error && (
                    <div className="alert alert-danger py-2">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {error}
                    </div>
                )}
                <section>
                    <h1>{game.title}</h1>

                    {game.image_url && (
                        <img src={`http://localhost:3000/image/${game.image_url}`} alt={game.title} />
                    )}
                    <ul>
                        <li><strong>Developer: </strong>{game.developer_name}</li>
                        <li><strong>Prezzo:</strong> {game.base_price}€</li>
                        <li><strong>Description:</strong> {game.description}</li>
                        <li><strong>Data di uscita:</strong> {game.release_date || 'Disponibile'}</li>
                        <li><strong>Genre: </strong>{game.genre}</li>
                        <button onClick={() => handleWish(game.id)}>
                            {controlWish ? (
                                <i className="bi bi-balloon-heart-fill"></i>
                            ) : (
                                <i className="bi bi-balloon-heart"></i>
                            )}
                        </button>
                    </ul>
                    <div className="d-flex align-items-center gap-3">
                        {cartItem && (
                            <button
                                className="btn btn-warning"
                                onClick={() => decreaseQuantity(game.id)}
                            >
                                -
                            </button>
                        )}
                        <span>{cartItem ? cartItem.quantity : 0} nel carrello</span>
                        <button
                            className={`btn ${isOutOfStock ? 'btn-secondary' : 'btn-success'}`}
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                        >
                            +
                        </button>
                    </div>
                    {cartItem && (
                        <button
                            className="btn btn-outline-danger btn-sm mt-3"
                            onClick={() => removeFromCart(game.id)}
                        >
                            Rimuovi tutti dal carrello
                        </button>
                    )}
                    <p className="mt-2">Quantità chiavi disponibili: {gameKeys?.available_keys ?? 0}</p>
                </section>
            </div>
        </main >
    );
};

export default GameDetail;