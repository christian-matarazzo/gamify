import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cart, setCart] = useState([])

    const addToCart = (product) => {
        setCart((prevCart) => {
            let newCart;
            const itemIndex = prevCart.findIndex((item) => item.id === product.id)
            if (itemIndex !== -1) {
                newCart = [...prevCart];
                newCart[itemIndex] = {
                    ...newCart[itemIndex],
                    quantity: newCart[itemIndex].quantity + 1
                };
            } else {
                newCart = [...prevCart, { ...product, quantity: 1 }];
            }
            console.log("🛒 Carrello aggiornato:", newCart);
            return newCart;
        });
    };

    const decreaseQuantity = (productId) => {
        setCart((prevCart) => {
            const itemIndex = prevCart.findIndex((item) => item.id === productId)
            if (itemIndex !== -1) {
                const item = prevCart[itemIndex];
                if (item.quantity > 1) {
                    const newCart = [...prevCart];
                    newCart[itemIndex] = {
                        ...item,
                        quantity: item.quantity - 1
                    };
                    console.log("🛒 Quantità diminuita:", newCart);
                    return newCart;
                } else {
                    return prevCart.filter((i) => i.id !== productId);
                }
            }
            return prevCart;
        })
    }

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, decreaseQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}
export const useCart = () => useContext(CartContext);