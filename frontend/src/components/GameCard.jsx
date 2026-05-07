import { Link } from 'react-router-dom';

export default function GameCard({ game }) {
    return (
        <div className="col-6 col-md-4 col-lg-3">
            <Link to={`/games/${game.slug}`} className="gamify-game-card">
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
        </div>
    );
}