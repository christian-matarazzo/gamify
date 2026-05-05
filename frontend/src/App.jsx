import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

function App() {
const giochi=
[{
  name: "Half-life",
  genre: "Action",
},
{
  name: "Pacman",
  genre: "Platform",
},
{
  name: "Farheneith",
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
    <AppHeader />
    <AppFooter />
    </>
  )
}

export default App
