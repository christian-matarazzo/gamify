import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const GameDetail = () => {
    const { slug } = useParams();


    const [game, setGame] = useState(null);


    useEffect(() => {

        axios.get(`http://localhost:3000/api/games/${slug}`)
            .then(response => {
                console.log("Dati ricevuti:", response.data)
                setGame(response.data.results)
            })
            .catch(error => {
                console.error("Cannot find any game", error)
                setGame(null);
            });
    }, [slug]);

    if (!game) return <h2>Prodotto non trovato</h2>;

    return (

        <div>

            <Link to="/">← Torna alla lista</Link>
            <hr />

            <section>
                <h1>{game.title}</h1>



                {game.image_url && (
                    <img src={`http://localhost:3000/image/${game.image_url}`} alt={game.title} />
                )}

                <ul>
                    <li><strong>Developer: </strong>{game.developer_name}</li>
                    <li><strong>Prezzo:</strong> {game.base_price}€</li>
                    <li><strong>Description:</strong> {game.description}</li>
                    <li><strong>Data di uscita:</strong> {game.release_date || 'Disponibile'}</li>
                    <li><strong>Genre: </strong>{game.genre}</li>
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