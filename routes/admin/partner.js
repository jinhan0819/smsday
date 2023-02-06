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

    /* 가맹점 사용료관리: 사용내역 및 사용료 지급/차감 */
    router.get('/partnerFeeList', partnerController.partnerFeeList);

    /* 가맹점 충전관리: 사용료 충전신청 및 승인 데이터 */
    router.get('/partnerChargeList', partnerController.partnerChargeList);

    return router;

};


