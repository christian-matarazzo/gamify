import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHeader from './components/AppHeader';
import DefaultLayout from "./layouts/DefaultLayout";
import Homepage from "./pages/Homepage";
import SearchPage from "./pages/SearchPage";
import AppFooter from './components/AppFooter';
import { GamesProvider } from "./context/GamesContext";
import GameDetail from "./pages/GameDetail";

function App() {
  return (

    <GamesProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/games/:slug" element={<GameDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GamesProvider>
  )
}

export default App;