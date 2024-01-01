const express = require('express')
const {getdata, getdownload, feeddata, postdata, dataFromEsp} = require('../controller/datacontroller.js')
const router = express.Router();

router.route('/s').get(getdata).post(feeddata,postdata);
router.route('/download').get(getdownload);
router.route('/senddata').get(dataFromEsp);

module.exports = router;