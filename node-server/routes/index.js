const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
	res.send('welcome  to base station');
});

module.exports = router;
