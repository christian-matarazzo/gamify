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
        if (ordered === "higher_price") return b.base_price - a.base_price;
        if (ordered === "lower_price") return a.base_price - b.base_price;
        if (ordered === "release_older") {
            return a.release_date.localeCompare(b.release_date);
        }
        if (ordered === "release_newer") {
            return b.release_date.localeCompare(a.release_date);
        }
        return 0;
    });

    return (
        <>
            <main className="container py-4">
                <div className="d-flex justify-content-between align-items-baseline mb-4">
                    <h1 className="gamify-section-title mb-0">
                        <span>Search</span> Games
                    </h1>

                    <h1 className="gamify-section-title mb-0">
                        <span>Filter</span> By
                    </h1>
                </div>

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
                        <option value="release_newer">Release Newer</option>
                        <option value="release_older">Release Older</option>
                        <option value="higher_price">Price: From Higher Price</option>
                        <option value="lower_price">Price: From Lower Price</option>
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