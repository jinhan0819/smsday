let express = require('express');
let smsController = require('../../controllers/admin/smsController');

module.exports = function () {

    let router = express.Router();

    /* 문자관리 */
    router.get('/smsTemplate', smsController.smsTemplate);

    /* 문자내역관리 */
    router.get('/smsLog', smsController.smsLog);

    return router;

};


