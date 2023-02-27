let express = require('express');
let pointController = require('../../controllers/admin/pointController');


module.exports = function () {

    let router = express.Router();

    /* 회원 Get 정보 */
    router.post('/getMemberByPtId', pointController.getMemberByPtId);

    /* 포인트 정보관리 */
    router.get('/pointList', pointController.pointList);
    router.post('/getMemberPointCount', pointController.getMemberPointCount);
    router.post('/getMemberPointList', pointController.getMemberPointList);
    router.post('/mbPointGiveInsert', pointController.mbPointGiveInsert);

    /* 포인트 충전관리 */
    router.get('/pointChargeList', pointController.pointChargeList);
    router.post('/getPointChargeCount', pointController.getPointChargeCount);
    router.post('/getPointChargeList', pointController.getPointChargeList);
    router.post('/pointApprove', pointController.pointApprove);
    
    return router;

};


