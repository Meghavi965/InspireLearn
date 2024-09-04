const express = require('express');
const router = express.Router();

// Home Page
router.get('/', (req, res) => res.render('home'));

// Personalized Learning Assessment Page
router.get('/assessment', (req, res) => res.render('assessment'));

module.exports = router;
