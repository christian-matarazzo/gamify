/* per avviare il server npm run dev */
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors()) /* per usare la stessa porta sulla stessa macchina evitando problemi di cors*/
app.use(express.json()) /* per parsare i file json e renderli leggibili */

app.get('/', (req, res) => {
  res.send('Il mio server')
}) /* la richiesta funziona */

app.post('/try', (req, res) => {
    console.log("Richiesta mandata con successo");
    
     res.status(200).json({ success: true, message: 'Prova ricevuto' })
}) /* la richiesta funziona */

app.listen(port, () => {
  console.log(`Il tuo server è sulla porta http://localhost:${port}`)
}) /* accesso rapido al localhost */