let express = require('express');
let configController = require('../../controllers/admin/configController');

module.exports = function () {

    let router = express.Router();

    /* 기본환경설정 */
    router.get('/configForm', configController.configForm);

    /* SMS설정 */
    router.get('/configSmsForm', configController.configSmsForm);

    /* SMS충전신청 */
    router.get('/ptSmsCharge', configController.ptSmsCharge);
    router.post('/getPtSmsChargeCount', configController.getPtSmsChargeCount);
    router.post('/getPtSmsChargeList', configController.getPtSmsChargeList);
    router.post('/ptSmsInsert', configController.ptSmsInsert);
    router.post('/ptSmsDelete', configController.ptSmsDelete);

    /* 차단IP 설정 */
    router.get('/ipAccess', configController.ipAccess);



    return router;

};


