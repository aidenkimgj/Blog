const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/send/pw', controller.api.sendPw);
router.get('/get/ip', controller.api.getIp);
router.post('/add/board', controller.add.board);
router.post('/add/user', controller.add.user);
router.post('/add/category', controller.add.category);
router.post('/get/board', controller.get.board);
router.post('/get/board_cnt', controller.get.board_cnt);
router.post('/get/board_data', controller.get.board_data);
router.get('/get/category', controller.get.category);
router.post('/update/view_cnt', controller.update.view_cnt);
router.post('/update/password', controller.update.password);
router.post('/delete/category', controller.delete.category);
router.post('/modify/category', controller.modify.category);
router.post('/search/id', controller.search.id);
router.post('/search/pw', controller.search.pw);

module.exports = router; 