let express = require('express');
let paymentController = require('../../controllers/front/paymentController');

module.exports = function () {

    let router = express.Router();

    router.get('/sms_price', paymentController.sms_price);
    router.get('/charge_history', paymentController.charge_history);
    router.get('/send_history', paymentController.send_history);

    /* 문자단가 */
    router.post('/chargeRequest', paymentController.chargeRequest); // 충전 요청

    return router;

};


