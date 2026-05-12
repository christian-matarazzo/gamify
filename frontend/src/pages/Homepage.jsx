import { useGames } from "../context/GamesContext";
import Hero from "../components/Hero";
import GameCard from "../components/GameCard";
import GhostCard from "../components/GhostCard";
import "../styles/Homepage.css";
import PopUp from "../components/PopUp"
import { useEffect, useState } from "react";

export default function Homepage() {

    const [showPopup, setShowPopup] = useState(false);
    const { games, loading } = useGames();

    useEffect(() => {
        const firstVisit = sessionStorage.getItem("gamifyPopUp");
        if (!firstVisit) {
            setShowPopup(true);
            sessionStorage.setItem("gamifyPopUp", "true");
        }
    }, []);

    const closePopUp = () => {
        setShowPopup(false);
    };

    return (
        <>
            {showPopup && (
                <PopUp onClose={closePopUp} />
            )}
            <Hero />
            <main className="container py-4">
                <div className="row g-3">
                    <h1 className="gamify-section-title"><span>Trending</span> Now!</h1>
                    {loading ? (
                        [...Array(6)].map((_, index) => <GhostCard key={index} />)
                    ) : (
                        games
                            .filter((game) => game.tag === "Trending")
                            .map((game) => <GameCard key={game.id} game={game} />)
                    )}
                </div>

                <div className="gamify-home-divider" />

                <div className="row g-3">
                    <h1 className="gamify-preorders"><span>Preorder</span> Now!</h1>
                    {loading ? (
                        [...Array(6)].map((_, index) => <GhostCard key={index} />)
                    ) : (
                        games
                            .filter((game) => game.tag === "Preorder")
                            .map((game) => <GameCard key={game.id} game={game} />)
                    )}
                </div>

                <div className="gamify-home-divider" />

                <div className="row g-3">
                    <h1 className="gamify-preorders"><span>Iconic</span> titles</h1>
                    {loading ? (
                        [...Array(6)].map((_, index) => <GhostCard key={index} />)
                    ) : (
                        games
                            .filter((game) => game.tag === "Iconic")
                            .map((game) => <GameCard key={game.id} game={game} />)
                    )}
                </div>


            </main>
        </>
    );
}