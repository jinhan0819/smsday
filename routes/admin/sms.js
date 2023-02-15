let express = require('express');
let smsController = require('../../controllers/admin/smsController');

module.exports = function () {

    let router = express.Router();

    /* 문자관리 */
    router.get('/smsTemplate', smsController.smsTemplate);
    router.post('/cateInsert', smsController.cateInsert);
    router.post('/cateDelete', smsController.cateDelete);
    router.post('/getCateList', smsController.getCateList);
    router.post('/smsInsert', smsController.smsInsert);
    router.post('/smsUpdate', smsController.smsUpdate);
    router.post('/smsDelete', smsController.smsDelete);
    router.post('/getSmsCount', smsController.getSmsCount);
    router.post('/getSmsHeaderCount', smsController.getSmsHeaderCount);
    router.post('/getSmsList', smsController.getSmsList);
    

    /* 문자내역관리 */
    router.get('/smsLog', smsController.smsLog);

    return router;

};


