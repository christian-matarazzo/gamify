import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const GamesContext = createContext();

export const GamesProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:3000/api/games")
            .then(response => {
                setGames(response.data.results);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching games:", error);
                setLoading(false);
            });
    }, []);

    return (
        <GamesContext.Provider value={{ games, loading }}>
            {children}
        </GamesContext.Provider>
    );
};

export const useGames = () => useContext(GamesContext);