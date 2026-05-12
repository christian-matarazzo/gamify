import { Link } from 'react-router-dom';

export default function GameCard({ game, isInWishlist = false, onToggleWish }) {
    return (
        <div className="col-6 col-md-4 col-lg-3 position-relative">
            <Link to={`/games/${game.slug}`} className="gamify-game-card">
                <div className="gamify-card-img-wrap">
                    <img
                        className="gamify-card-thumbnail"
                        src={`http://localhost:3000/image/${game.image_url}`}
                        alt={game.title}
                    />
                    {onToggleWish && (
                        <button
                            type="button"
                            className={`gamify-detail-wish-btn${isInWishlist ? ' active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation(); 
                                e.preventDefault();  
                                onToggleWish();
                            }}
                            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <i className={`bi bi-heart${isInWishlist ? '-fill' : ''}`}></i>
                        </button>
                    )}
                </div>
                <div className="gamify-card-body">
                    <p className="gamify-card-title">{game.title}</p>
                    <p className="gamify-price-current">€{game.base_price}</p>
                </div>
            </Link>
        </div>
    );
}