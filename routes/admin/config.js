let express = require('express');
let configController = require('../../controllers/admin/configController');

module.exports = function () {

    let router = express.Router();

    /* 기본환경설정 */
    router.get('/configForm', configController.configForm);

    /* sms설정 */
    router.get('/configSmsForm', configController.configSmsForm);

    /* 가맹점 충전신청 */
    router.get('/ptChargeForm', configController.ptChargeForm);

    /* 차단IP 설정 */
    router.get('/ipAccess', configController.ipAccess);


    return router;

};


