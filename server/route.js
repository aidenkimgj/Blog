const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/send/pw', controller.api.sendPw);
router.post('/add/board', controller.add.board);
router.post('/get/board', controller.get.board);
router.post('/get/board_cnt', controller.get.board_cnt);
router.post('/get/board_data', controller.get.board_data);
router.post('/update/view_cnt', controller.update.view_cnt);
router.get('/get/category', controller.get.category);
router.post('/add/category', controller.add.category);

module.exports = router; 