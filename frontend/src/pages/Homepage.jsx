import { useGames } from "../context/GamesContext";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";

export default function Homepage() {

    const { games, loading } = useGames();

    if (loading) {
        return <h2>Loading games... Please wait!</h2>;
    }

    return (
        <>
            <Hero />
            <main className="container py-4">
                <ul>
                    {games.map((game) => (
                        <li key={game.id}>
                            <Link to={`/games/${game.slug}`}>
                                <img src={`http://localhost:3000/image/${game.image_url}`} alt={game.title} />
                            </Link>
                        </li>
                    ))}
                </ul>
            </main>
        </>
    );
}