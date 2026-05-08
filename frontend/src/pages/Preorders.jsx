import { useGames } from "../context/GamesContext";
import GameCard from "../components/GameCard";
import GhostCard from "../components/GhostCard";
import "../styles/Homepage.css";
import "../styles/Preorder.css"

export default function Preorders() {
    const { games, loading } = useGames();

    return (
        <main className="container py-4">
            <h1 className="gamify-preorders">
                Be the first to the <span>Frontline</span>, play before the rest!
            </h1>

            <p className="gamify-preorder-description">
                Don't wait for the release day. Secure your copy now and get
                <strong> exclusive early access </strong> and <strong> bonus content </strong>
                on the most anticipated titles of the year.
            </p>
            {!loading && (
                <div className="gamify-perks-banner mt-5">
                    <h3 className="gamify-perks-title">Why <span>Preorder</span> with Gamify?</h3>
                    <div className="row g-2">
                        <div className="col-12 col-md-4">
                            <div className="gamify-perk-item">
                                <div className="gamify-perk-icon"><i className="bi bi-truck"></i></div>
                                <div>
                                    <p className="gamify-single-perk">Day One Delivery</p>
                                    <p className="gamify-perk-desc">Your copy arrives on launch day, no delays.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="gamify-perk-item">
                                <div className="gamify-perk-icon"><i className="bi bi-tag"></i></div>
                                <div>
                                    <p className="gamify-single-perk">Lowest Price Guaranteed</p>
                                    <p className="gamify-perk-desc">We match any lower price found before release.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="gamify-perk-item">
                                <div className="gamify-perk-icon"><i className="bi bi-gift"></i></div>
                                <div>
                                    <p className="gamify-single-perk">Exclusive Digital Bonuses</p>
                                    <p className="gamify-perk-desc">Unlock in-game items only for preorder customers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row g-3">
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <GhostCard key={index} />
                    ))
                ) : (
                    games
                        .filter((game) => game.tag === "Preorder")
                        .map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))
                )}
            </div>

        </main>
    );
}