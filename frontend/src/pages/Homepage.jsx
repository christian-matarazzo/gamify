import { useGames } from "../context/GamesContext";
import Hero from "../components/Hero";
import GameCard from "../components/GameCard";
import GhostCard from "../components/GhostCard";
import "../styles/Homepage.css";

export default function Homepage() {
    const { games, loading } = useGames();

    return (
        <>
            <Hero />
            <main className="container py-4">
                <div className="row g-3">
                    <h1 className="gamify-section-title"><span>Trending</span> Now!</h1>
                    {loading ? (
                        [...Array(6)].map((_, index) => <GhostCard key={index} />)
                    ) : (
                        games
                            .filter((game) => game.tag !== "Preorder") 
                            .map((game) => <GameCard key={game.id} game={game} />)
                    )}
                </div>

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
            </main>
        </>
    );
}