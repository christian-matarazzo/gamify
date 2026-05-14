const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const inventoryController=require("../controllers/inventoryController")

router.get('/', inventoryController.inventory);



module.exports = router;