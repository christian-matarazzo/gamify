const express = require('express');
const router = express.Router();
const gamesController = require("../controllers/gamesController");


router.get('/', gamesController.index);

router.get('/:slug', gamesController.show);

module.exports = router;