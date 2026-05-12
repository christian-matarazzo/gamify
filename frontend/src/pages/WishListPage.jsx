import "../styles/Wishlist.css";
import { useGames } from '../context/GamesContext';
import { useWish } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import GhostCard from '../components/GhostCard';

export default function WishPage() {
    const { games, loading } = useGames();
    const { wish, handleWish } = useWish();

    const wishGames = games.filter(game => wish.includes(game.id));

    return (
        <>
            <main className="container py-4">
                <div className="wishlist-header">
                    <div>
                        <h1 className="wishlist-title">My<span className="wishlist-accent"> Wishlist</span></h1>
                        <span className="wishlist-count">{wishGames.length} games</span>
                    </div>
                    {wishGames.length > 0 && (
                        <button className="wishlist-clear-btn" onClick={() => wish.forEach(id => handleWish(id))}>
                            Remove all
                        </button>
                    )}
                </div>
                {loading ? (
                    <div className="row g-3">
                        {[...Array(4)].map((_, i) => <GhostCard key={i} />)}
                    </div>
                ) : wishGames.length === 0 ? (
                    <div className="wishlist-empty">
                        <i className="bi bi-heart wishlist-empty-icon"></i>
                        <p>No games in your wishlist yet.</p>
                        <Link to="/search" className="gamify-btn-login">Explore Games</Link>
                    </div>
                ) : (
                    <div className="row g-3">
                        {wishGames.map(game => (
                            <div key={game.id} className="col-6 col-md-4 col-lg-3">
                                <div className="gamify-game-card wishlist-card-wrapper">
                                    <Link to={`/games/${game.slug}`} className="gamify-game-card-inner">
                                        <div className="gamify-card-img-wrap">
                                            <img
                                                className="gamify-card-thumbnail"
                                                src={`http://localhost:3000/image/${game.image_url}`}
                                                alt={game.title}
                                            />
                                        </div>
                                        <div className="gamify-card-body">
                                            <p className="gamify-card-title">{game.title}</p>
                                            <p className="gamify-price-current">€{game.base_price}</p>
                                        </div>
                                    </Link>
                                    <button
                                        className="wishlist-remove-btn"
                                        onClick={() => handleWish(game.id)}
                                        aria-label="Remove from wishlist"
                                    >
                                        <i className="bi bi-heart-fill"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}