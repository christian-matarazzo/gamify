import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from "../context/CartContext";
import {useWish} from "../context/WishlistContext"

const GameDetail = () => {
    const { slug } = useParams();
    const [game, setGame] = useState(null);
    const {wish,handleWish} =useWish();
    console.log(wish[0]);
    
    useEffect(() => {
        axios.get(`http://localhost:3000/api/games/${slug}`)
            .then(response => {
                setGame(response.data.results)
            })
            .catch(error => {
                setGame(null);
            });
    }, [slug]);

    const { addToCart, removeFromCart, decreaseQuantity, cart } = useCart();
    const isInCart = cart.find(item => item.id === game?.id);
    const cartItem = cart.find(item => item.id === game?.id);
    const controlWish = wish.includes(game?.id);
   
    if (!game) return <h2>Prodotto non trovato</h2>;

    return (
        <main className="container py-4">
            <div>
                <Link to="/">← Torna alla lista</Link>
                <hr />
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
                        <button onClick={()=> handleWish(game.id)}>
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
                            className="btn btn-success"
                            onClick={() => addToCart(game)}
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
                    
                </section>
            </div>
        </main >
    );
};

export default GameDetail;