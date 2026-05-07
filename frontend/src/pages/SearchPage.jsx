import { useState } from 'react'
import { useGames } from '../context/GamesContext';
import GameCard from '../components/GameCard';
import GhostCard from '../components/GhostCard';
import "../styles/SearchPage.css";

export default function SearchPage() {
    const { games, loading } = useGames();
    const [query, setQuery] = useState("");
    const [ordered, setOrdered] = useState("title");
    const filtered = games.filter(game =>
        game.title?.toLowerCase().includes(query.trim().toLowerCase()
        ))
    const orderedSearch = [...filtered].sort((a, b) => {
        if (ordered === "price") return b.base_price - a.base_price;
        if (ordered === "year") {
            return b.release_date.localeCompare(a.release_date);
        }
        return a.title.localeCompare(b.title);
    });

    return (
        <>
            <main className="container py-4">
                <h1 className="gamify-section-title mb-4">
                    <span>Search</span> Games
                </h1>

                <div className="gamify-search-bar mb-4">
                    <div className="gamify-search-input-wrapper">
                        <i className="bi bi-search gamify-search-icon"></i>
                        <input
                            type="text"
                            placeholder="Search game..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="gamify-search-input"
                        />
                    </div>
                    <select
                        value={ordered}
                        onChange={e => setOrdered(e.target.value)}
                        className="gamify-select"
                    >
                        <option value="title">Name</option>
                        <option value="year">Year</option>
                        <option value="price">Price</option>
                    </select>
                </div>
                {!loading && (
                    <p className="gamify-results mb-3">
                        <span>{orderedSearch.length}</span> result{orderedSearch.length !== 1 ? "s" : ""}
                    </p>
                )}
                <div className="row g-3">
                    {loading ? (
                        [...Array(6)].map((_, i) => <GhostCard key={i} />)
                    ) : orderedSearch.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-emoji-frown display-1 text-secondary"></i>
                            <p className="gamify-no-results">No games found for "{query}".</p>
                        </div>
                    ) : (
                        orderedSearch.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))
                    )}
                </div>
            </main>
        </>
    );
}