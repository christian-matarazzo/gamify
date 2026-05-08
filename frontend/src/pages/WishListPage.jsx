import "../styles/Wishlist.css"
import { useGames } from '../context/GamesContext';

export default function WishPage() {
    const { games, loading } = useGames();
    return (
        <>
            <div id="top-container">
                <div id="text-container">
                    <h1 className="wishTitle">WISHLIST</h1>
                    <p className="description">Every Game that you love in a single place, just for you</p>
                </div>
                <img id="logo" src="/img/gamify-logo-small.png" alt="logo" />
            </div>
            <div className="middle-container">
                <p>* games in your wishlist</p>

            </div>
            
        </>
    )


}
