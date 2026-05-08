const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const inventoryController=require("../controllers/inventoryController")

/* conteggio dei giochi e delle chiavi disponibili per ogni gioco */
router.get('/', inventoryController.inventory);



module.exports = router;