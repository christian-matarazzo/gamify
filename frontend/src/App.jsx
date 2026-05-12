import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Homepage from "./pages/Homepage";
import SearchPage from "./pages/SearchPage";
import Preorders from "./pages/Preorders";
import CartPage from "./pages/CartPage";
import { GamesProvider } from "./context/GamesContext";
import GameDetail from "./pages/GameDetail";
import { CartProvider } from "./context/CartContext"
import WishListPage from "./pages/WishListPage";
import { WishlistProvider } from "./context/WishlistContext";
import ScrollToTop from "./components/ScrollToTop";
import CheckoutPage from "./pages/CheckoutPage";
import SupportPage from "./pages/SupportPage";

function App() {
  return (
    <GamesProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
          <ScrollToTop />
            <Routes>
              <Route element={<DefaultLayout />}>
                <Route path="/" element={<Homepage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/games/preorders" element={<Preorders />} />
                <Route path="/games/:slug" element={<GameDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishListPage />} />
                <Route path="/checkout" element={<CheckoutPage/>}/>
                <Route path="/support" element={<SupportPage/>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </GamesProvider>
  )
}

export default App;