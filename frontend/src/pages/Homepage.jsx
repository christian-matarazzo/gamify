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
            <div className="gamify-trust-bar">
                <div className="gamify-trust-inner">
                    <div className="gamify-trust-item">
                        <span className="gamify-trust-icon">
                            <i className="bi bi-lightning-charge"></i>
                        </span>
                        <div>
                            <p className="gamify-trust-title">Ultra fast delivery</p>
                            <p className="gamify-trust-sub">Instant digital download</p>
                        </div>
                    </div>

                    <div className="gamify-trust-divider" />

                    <div className="gamify-trust-item">
                        <span className="gamify-trust-icon">
                            <i className="bi bi-shield-check"></i>
                        </span>
                        <div>
                            <p className="gamify-trust-title">Reliable & safe</p>
                            <p className="gamify-trust-sub">Over 20.000 titles</p>
                        </div>
                    </div>

                    <div className="gamify-trust-divider" />

                    <div className="gamify-trust-item">
                        <span className="gamify-trust-icon">
                            <i className="bi bi-headset"></i>
                        </span>
                        <div>
                            <p className="gamify-trust-title">Customer support</p>
                            <p className="gamify-trust-sub">Our agents are online 24/7</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}