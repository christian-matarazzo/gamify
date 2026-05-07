import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHeader from './components/AppHeader';
import DefaultLayout from "./layouts/DefaultLayout";
import Homepage from "./pages/Homepage";
import SearchPage from "./pages/SearchPage";
import CartPage from "./pages/CartPage";
import AppFooter from './components/AppFooter';
import { GamesProvider } from "./context/GamesContext";
import GameDetail from "./pages/GameDetail";
import { CartProvider } from "./context/CartContext"

function App() {
  return (

    <GamesProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<DefaultLayout />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/games/:slug" element={<GameDetail />} />
              <Route path="/cart" element={<CartPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </GamesProvider>
  )
}

export default App;