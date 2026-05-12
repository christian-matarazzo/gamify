import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = sessionStorage.getItem("gamify_cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        sessionStorage.setItem("gamify_cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const itemIndex = prevCart.findIndex((item) => item.id === product.id);
            const currentQuantity = itemIndex !== -1 ? prevCart[itemIndex].quantity : 0;

            if (currentQuantity >= product.stock) {
                return prevCart;
            }

            let newCart;
            if (itemIndex !== -1) {
                newCart = [...prevCart];
                newCart[itemIndex] = {
                    ...newCart[itemIndex],
                    quantity: newCart[itemIndex].quantity + 1
                };
            } else {
                newCart = [...prevCart, { ...product, quantity: 1 }];
            }
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

    const clearCart = () => {
    sessionStorage.removeItem("gamify_cart");
    setCart([]);
};

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, decreaseQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext);