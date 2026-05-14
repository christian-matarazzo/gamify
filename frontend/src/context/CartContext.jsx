// frontend/src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();
const STORAGE_KEY = "gamify_cart";

export const CartProvider = ({ children }) => {
  // --- Caricamento iniziale carrello da sessionStorage ---
  const [cart, setCart] = useState(() => {
    try {
      const savedData = sessionStorage.getItem(STORAGE_KEY);
      if (!savedData) return [];
      const parsed = JSON.parse(savedData);
      if (Array.isArray(parsed)) return parsed;
      if (parsed?.items && Array.isArray(parsed.items)) return parsed.items;
      return [];
    } catch (error) {
      console.error("Errore caricamento carrello:", error);
      return [];
    }
  });

  // --- Caricamento iniziale coupon da sessionStorage ---
  const [couponData, setCouponData] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.coupon && typeof parsed.discount === "number") {
          return { appliedCoupon: parsed.coupon, discountAmount: parsed.discount };
        }
      }
    } catch (e) {
      console.warn("Errore parsing coupon da sessionStorage:", e);
    }
    return { appliedCoupon: null, discountAmount: 0 };
  });

  // --- Subtotal: somma base_price × quantity (MAI con sconto) ---
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item?.base_price) || 0;
      const qty = parseInt(item?.quantity) || 0;
      return sum + price * qty;
    }, 0);
  }, [cart]);

  // --- Total: subtotal - discount fisso (cappato a 0 per evitare negativi) ---
  const total = useMemo(() => {
    if (!couponData.appliedCoupon || couponData.discountAmount <= 0) return subtotal;
    const effectiveDiscount = Math.min(couponData.discountAmount, subtotal);
    return Math.max(0, subtotal - effectiveDiscount);
  }, [subtotal, couponData]);

  // --- Persistenza automatica su sessionStorage ---
  useEffect(() => {
    const cartData = {
      items: cart,
      coupon: couponData.appliedCoupon,
      discount: couponData.discountAmount,  // Valore FISSO originale
      finalTotal: total
    };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error("Errore salvataggio sessionStorage:", error);
    }
  }, [cart, couponData, total]);

  const saveCartWithMetadata = (itemsArray, couponCode, discountValue, finalTotalValue) => {
    const cartData = {
      items: itemsArray,
      coupon: couponCode,
      discount: discountValue,
      finalTotal: finalTotalValue
    };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error("Errore salvataggio sessionStorage:", error);
    }
  };

  // --- Azioni carrello ---
  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingIndex = previousCart.findIndex(i => i.id === product.id);
      const currentQty = existingIndex !== -1 ? previousCart[existingIndex].quantity : 0;
      const availableStock = product.stock ?? Infinity;
      
      if (currentQty >= availableStock) return previousCart;

      if (existingIndex !== -1) {
        const updated = [...previousCart];
        updated[existingIndex] = { ...updated[existingIndex], quantity: currentQty + 1 };
        return updated;
      }
      return [...previousCart, { ...product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (productId) => {
    setCart((previousCart) => {
      const idx = previousCart.findIndex(i => i.id === productId);
      if (idx === -1) return previousCart;
      
      const item = previousCart[idx];
      if (item.quantity > 1) {
        const updated = [...previousCart];
        updated[idx] = { ...item, quantity: item.quantity - 1 };
        return updated;
      }
      return previousCart.filter(i => i.id !== productId);
    });
  };

  const removeFromCart = (productId) => {
    setCart((previousCart) => 
      previousCart.filter(item => item.id !== productId)
    );
  };

  const clearCart = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setCart([]);
    setCouponData({ appliedCoupon: null, discountAmount: 0 });
  };

  // --- Gestione Coupon (VALORE FISSO, non percentuale) ---
  const applyCoupon = (couponCode, fixedDiscountAmount) => {
    // fixedDiscountAmount è il valore ESATTO dal backend (es. 10 per €10 off)
    setCouponData({ appliedCoupon: couponCode, discountAmount: fixedDiscountAmount });
  };

  const removeCoupon = () => {
    setCouponData({ appliedCoupon: null, discountAmount: 0 });
  };

  // --- Helper: restituisce SOLO il prezzo base (NESSUNA distribuzione sconto) ---
  const getItemPrice = (item) => {
    return parseFloat(item?.base_price) || 0;
  };

  // --- Helper: restituisce lo sconto EFFETTIVAMENTE applicato (cappato a subtotal) ---
  const getAppliedDiscount = () => {
    if (!couponData.appliedCoupon || couponData.discountAmount <= 0) return 0;
    return Math.min(couponData.discountAmount, subtotal);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        couponData,           // { appliedCoupon, discountAmount: valore FISSO }
        subtotal,             // Somma base_price × qty (senza sconto)
        total,                // subtotal - sconto applicato (mai negativo)
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,          // (code, fixedAmount) => void
        removeCoupon,         // () => void
        getItemPrice,         // (item) => base_price only
        getAppliedDiscount,   // () => sconto effettivo (cappato)
        saveCartWithMetadata
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve essere usato dentro CartProvider");
  }
  return context;
};