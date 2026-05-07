const express = require('express');
const cors = require('cors');
const gamesRoute = require('./routes/games'); 
const app = express();
const port = 3000;

app.use(express.static('public'))
app.use(cors());
app.use(express.json());


app.use('/api/games', gamesRoute);

app.get('/', (req, res) => {
  res.send('Il mio server');
});

app.post('/try', (req, res) => {
    console.log("Richiesta mandata con successo");
    res.status(200).json({ success: true, message: 'Funziono' });
});

app.listen(port, () => {
  console.log(`Il tuo server è sulla porta http://localhost:${port}`);
});
