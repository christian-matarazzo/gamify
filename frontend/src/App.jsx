import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHeader from './components/AppHeader';
import DefaultLayout from "./layouts/DefaultLayout";
import Homepage from "./pages/Homepage";
import SearchPage from "./pages/SearchPage";
import AppFooter from './components/AppFooter';


function App() {
  const giochi =
    [{
      name: "Half-Life",
      genre: "Action",
    },
    {
      name: "Pac-Man",
      genre: "Platform",
    },
    {
      name: "Fahrenheit",
      genre: "Adventure",
    },
    {
      name: "Elden Ring",
      genre: "RPG",
    },
    {
      name: "Cars",
      genre: "Race",
    }
    ]
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
