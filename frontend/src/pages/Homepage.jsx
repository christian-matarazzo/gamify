import { useGames } from "../context/GamesContext"; 

export default function Homepage() {

    const { games, loading } = useGames();

    if (loading) {
        return <h2>Loading games... Please wait!</h2>;
    }

    return (
        <>
            <ul>
                {games.map((game) => (
                    <li key={game.id}>{game.title}</li>
                ))}
            </ul>
        </>
    );
}