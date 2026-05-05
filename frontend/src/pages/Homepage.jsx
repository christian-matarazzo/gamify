import { useEffect, useState } from "react";
import axios from "axios";

export default function Homepage() {

    const [games, setGames] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/api/games")
            .then(response => {
                console.log(response.data);
                setGames(response.data.results);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

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