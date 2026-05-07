import { useState } from 'react'
import { useGames } from '../context/GamesContext';

export default function SearchPage() {
    const { games, loading } = useGames();

    const [query, setQuery] = useState("");
    const [ordered, setOrdered] = useState("title");

    if (loading) return <p>Caricamento in corso, attendere</p>;

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
            <div className="search-page">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search game..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="search-input"
                    />

                    <select
                        value={ordered}
                        onChange={e => setOrdered(e.target.value)}
                        className="orderd-select"
                    >
                        <option value="title">Name</option>
                        <option value="year">Year</option>
                        <option value="price">Price</option>
                    </select>
                </div>

                <div className="results-list">
                    {orderedSearch.length === 0 ? (
                        <p className="no-results">Game no found.</p>
                    ) : (
                        orderedSearch.map(game => (
                            <div key={game.id} className="result-card">
                                <h3 className="result-title">{game.title}</h3>
                                <p className="result-genre">{game.genre}</p>
                                <p className="result-year">{game.release_date}</p>
                                <p className="result-price">{game.base_price}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    )
}