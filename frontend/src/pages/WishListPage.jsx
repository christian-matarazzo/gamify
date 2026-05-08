import "../styles/Wishlist.css"
import { useGames } from '../context/GamesContext';
import {useWish} from '../context/WishlistContext';


export default function WishPage() {
    const { games, loading } = useGames();
    const {wish,handleWish} =useWish();

    const wishGames = games.filter(game=> wish.includes(game.id));
   
        


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
                <p>{wishGames.length} games in your wishlist</p>
                {wishGames. length === 0 ? (
                    <p>No games Found in your wishlist, explore<a href="http://localhost:5173/search"></a> to see more</p>                    
                ) : (
                    wishGames.map(game=>(
                        <div key={game.id} className="wishlist-card">
                            <h3>{game.title}</h3>
                            <p>{game.base_price}€</p>
                            <button onClick={()=>handleWish(game.id)}><i className="bi bi-balloon-heart-fill"></i></button>
                        </div>
                    ))
                )}
            </div>
            
        </>
    )


}
