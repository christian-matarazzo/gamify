import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const GameDetail = () => {
    const { id } = useParams();
    console.log("ID del gioco:", id);


    const [game, setGame] = useState(null);


    useEffect(() => {
        console.log("Chiamo l'API per l'ID:", id);
        axios.get(`http://localhost:3000/api/games/${id}`)
            .then(response => {
                console.log("Dati ricevuti:", response.data)
                setGame(response.data.results)
            })
            .catch(error => {
                console.error("Cannot find any game", error)
                setGame(null);
            });
    }, [id]);

    if (!game) return <h2>Prodotto non trovato</h2>;

    return (

        <div
        >
            <Link to="/">← Torna alla lista</Link>
            <hr />

            <section>
                <h1>{game.title}</h1>

                {game.image_url && (
                    <img
                        src={game.image_url}
                        alt={game.title}
                    />
                )}

                <ul>
                    <li><strong>Piattaforma:</strong> {game.platform}</li>
                    <li><strong>Prezzo:</strong> {game.price}€</li>
                    <li><strong>Rating:</strong> {game.rating ? `${game.rating}/10` : 'N/A'}</li>
                    <li><strong>Data di uscita:</strong> {game.release_date || 'Disponibile'}</li>
                </ul>

                <div>
                    <button onClick={() => alert(`Stai acquistando la chiave per ${game.title}`)}>
                        Acquista ora
                    </button>
                </div>
            </section>
        </div>
    );
};

export default GameDetail;