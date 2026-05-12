// frontend/src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const STORAGE_KEY = "gamify_cart";

export const CartProvider = ({ children }) => {
  
  // ✅ Inizializzazione robusta: gestisce sia array che oggetti con metadata
  const [cart, setCart] = useState(() => {
    try {
      const savedData = sessionStorage.getItem(STORAGE_KEY);
      if (savedData === null) {
        return [];
      }
      
      const parsedData = JSON.parse(savedData);
      
      // Se è un array, restituiscilo direttamente
      if (Array.isArray(parsedData)) {
        return parsedData;
      }
      
      // Se è un oggetto con proprietà "items", estrai l'array
      if (parsedData !== null && typeof parsedData === "object" && Array.isArray(parsedData.items)) {
        return parsedData.items;
      }
      
      // Fallback per dati non validi
      return [];
    } catch (error) {
      console.error("Errore nel caricamento del carrello da sessionStorage:", error);
      return [];
    }
  });

  // ✅ Sincronizzazione automatica: ogni cambiamento dello state viene salvato
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Errore nel salvataggio del carrello su sessionStorage:", error);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingItemIndex = previousCart.findIndex((cartItem) => cartItem.id === product.id);
      const currentQuantity = existingItemIndex !== -1 
        ? previousCart[existingItemIndex].quantity 
        : 0;

      const availableStock = product.stock !== undefined ? product.stock : Infinity;
      if (currentQuantity >= availableStock) {
        return previousCart;
      }

      if (existingItemIndex !== -1) {
        const updatedCart = [...previousCart];
        updatedCart[existingItemIndex] = { 
          ...updatedCart[existingItemIndex], 
          quantity: currentQuantity + 1 
        };
        return updatedCart;
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (productId) => {
    setCart((previousCart) => {
      const itemIndex = previousCart.findIndex((cartItem) => cartItem.id === productId);
      
      if (itemIndex === -1) {
        return previousCart;
      }

      const currentItem = previousCart[itemIndex];
      
      if (currentItem.quantity > 1) {
        const updatedCart = [...previousCart];
        updatedCart[itemIndex] = { 
          ...currentItem, 
          quantity: currentItem.quantity - 1 
        };
        return updatedCart;
      }

      return previousCart.filter((cartItem) => cartItem.id !== productId);
    });
  };

  const removeFromCart = (productId) => {
    setCart((previousCart) => {
      return previousCart.filter((cartItem) => cartItem.id !== productId);
    });
  };

  // ✅ clearCart ora rimuove anche da sessionStorage
  const clearCart = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setCart([]);
  };

  // ✅ Helper per salvare carrello con metadata (coupon, discount) in formato compatibile
  const saveCartWithMetadata = (itemsArray, couponCode, discountValue, finalTotalValue) => {
    const cartData = {
      items: itemsArray,
      coupon: couponCode,
      discount: discountValue,
      finalTotal: finalTotalValue
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cartData));
    // Importante: aggiorna lo state con il solo array, non con l'oggetto completo
    setCart(itemsArray);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      decreaseQuantity, 
      removeFromCart, 
      clearCart,
      saveCartWithMetadata
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart deve essere utilizzato all'interno di un CartProvider");
  }
  return context;
};