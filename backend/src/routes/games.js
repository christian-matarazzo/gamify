const express = require('express');
const router = express.Router();
const gamesController = require("../controllers/gamesControllers");


router.get('/', gamesController.index);

router.get('/:id', gamesController.show);

module.exports = router;