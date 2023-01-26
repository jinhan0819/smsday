let express = require('express');
let paymentController = require('../../controllers/front/paymentController');

module.exports = function () {

    let router = express.Router();

    router.get('/sms_price', paymentController.sms_price);
    router.get('/charge_history', paymentController.charge_history);
    router.get('/send_history', paymentController.send_history);

    return router;

};


