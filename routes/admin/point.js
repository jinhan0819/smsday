let express = require('express');
let pointController = require('../../controllers/admin/pointController');


module.exports = function () {

    let router = express.Router();

    /* 포인트 정보관리 */
    router.get('/pointList', pointController.pointList);

    /* 포인트 충전관리 */
    router.get('/pointChargeList', pointController.pointChargeList);
    
    return router;

};


