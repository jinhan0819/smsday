let express = require('express');
let partnerController = require('../../controllers/admin/partnerController');


module.exports = function () {

    let router = express.Router();

    /* 가맹점 정보관리 */
    router.get('/partnerList', partnerController.partnerList);
    router.post('/getPartnerCount', partnerController.getPartnerCount);
    router.post('/getPartnerList', partnerController.getPartnerList);
    router.post('/getPartnerDetail', partnerController.getPartnerDetail);
    router.post('/partnerModify', partnerController.partnerModify);

    /* 가맹점 신규신청 */
    router.get('/partnerForm', partnerController.partnerForm);

    return router;

};


