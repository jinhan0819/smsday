let express = require('express');
let smsController = require('../../controllers/front/smsController');


module.exports = function () {

    let router = express.Router();

    router.get('/sms_send', smsController.sms_send);
    router.get('/img_sms_send', smsController.img_sms_send);
    router.get('/large_sms_send', smsController.large_sms_send);

    return router;

};


