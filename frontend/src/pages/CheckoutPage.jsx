import { useEffect, useState } from "react"
import axios from "axios";


export default function CheckoutPage(){

    const [email,setEmail] = useState("")
    const [coupon,setCoupon] = useState("")
    const [cartItems,setCartItems]= useState([])
    const [result,setResult]= useState(null)
    const [error,setError]= useState("")
    
    const handlePurchase = async (e) =>{
    axios.post('http://localhost:3000/api/orders/purchase',{
        email:email,
        items:cartItems.map(item=>({
            game_id:item.id,
            quantity:item.quantity,
        })),
        coupon:coupon.trim() || null
        
    }
);

}

    useEffect(()=>{
        const cart=localStorage.getItem("gamify_cart") 
        if(cart){
            setCartItems(JSON.parse(cart))
        }
    },[])
    console.log(cartItems);
    
    
    return(
        <>
        <form >
            <input type="text" placeholder="Insert Email" value={email} onChange={(e)=> setEmail(e.target.value)} />
            <input type="text" value={coupon} onChange={(e)=> setCoupon(e.target.value)} />
            <button onClick={handlePurchase}> Purchase</button>
        </form>
        </>
    )
}