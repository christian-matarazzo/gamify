import { useEffect, useState } from "react"
import axios from "axios";


export default function CheckoutPage() {


    const [email, setEmail] = useState("")
    const [coupon, setCoupon] = useState("")
    const [cartItems, setCartItems] = useState([])
    const [result, setResult] = useState(null)
    const [error, setError] = useState("")

    const handlePurchase = async (e) => {
        axios.post('http://localhost:3000/api/orders/purchase', {
            email: email,
            items: cartItems.map(item => ({
                game_id: item.id,
                quantity: item.quantity,
            })),
            coupon: coupon.trim() || null

        }
        );

    }


    useEffect(() => {
        const cart = localStorage.getItem("gamify_cart")
        if (cart) {
            setCartItems(JSON.parse(cart))
        }
    }, [])
    console.log(cartItems);


    return (
        <>
            <form >
                <input type="text" placeholder="Insert Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                <button onClick={handlePurchase}> Purchase</button>
                <div className="container">
                    <div className="row row-cols-2">
                        <div className="col">
                            <div className="card">
                                <h3>INDIRIZZO</h3>
                                <p>Nome Cognome</p>
                                <p>Iva</p>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card">
                                <h2>Riepilogo</h2>
                                <p>Prezzo Totale:</p>
                                <p></p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                            <div className="card">
                                <h3>Metodo di pagamento:</h3>
                                <p>Apple Pay</p>
                                <p>Revolut</p>
                                <p>Visa Card</p>
                                <p>Paypal</p>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}