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

    /* 가맹점 사용내역: 사용포인트, 잔여포인트 등 */
    router.get('/partnerFeeList', partnerController.partnerFeeList);

    /* 가맹점 충전관리: 충전신청 및 승인 데이터(승인시 삭제) */
    router.get('/partnerFeeApplyList', partnerController.partnerFeeApplyList);

    /* 가맹점 충전내역: 충전내역 데이터 */
    router.get('/partnerFeeHistoryList', partnerController.partnerFeeHistoryList);

    return router;

};


