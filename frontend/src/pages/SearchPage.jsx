import { useState } from 'react'
import { useGames } from '../context/GamesContext';
export default function SearchPage() {

    const games = [
        {
            id: 1,
            title: "The Legend of Zelda: Breath of the Wild",
            genre: "Action-Adventure",
            year: 2017,
            price: 30.00
        },
        {
            id: 2,
            title: "Red Dead Redemption 2",
            genre: "Open World",
            year: 2018,
            price: 23.50
        },
        {
            id: 3,
            title: "Hollow Knight",
            genre: "Metroidvania",
            year: 2017,
            price: 49.70
        }
    ];


    const [query, setQuery] = useState("");
    const [ordered, setOrdered] = useState("title");

    const filtered = games.filter(game =>
        game.title.toLowerCase().includes(query.toLowerCase()
        ))

    const orderedSearch = [...filtered].sort((a, b) => {
        if (ordered === "price") return b.price - a.price
        if (ordered === "year") return b.year - a.year
        return a.title.localeCompare(b.title)
    })


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
                                <p className="result-year">{game.year}</p>
                                <p className="result-price">{game.price}</p>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </>
    )
}