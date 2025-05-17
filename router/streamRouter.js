const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {startStream , endStream , getStreams , updateViews} = require('../controllers/streamController');


router.route('/start').get(authMiddleware , startStream );
router.route('/end/:streamKey').get(authMiddleware ,endStream);
router.route('/').get(authMiddleware , getStreams);
// router.route('/rename').put(authMiddleware ,renameGroup);
// router.route('/groupremove').put(authMiddleware ,removeFromGroup);
// router.route('/groupadd').put(authMiddleware ,addToGroup);

module.exports = router;