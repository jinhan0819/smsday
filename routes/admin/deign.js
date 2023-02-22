let express = require('express');
let deignController = require('../../controllers/admin/deignController');

module.exports = function () {

    let router = express.Router();

    /* 로고 관리 */
    router.get('/logoForm', deignController.logoForm);

    /* 배너 관리 */
    router.get('/bannerList', deignController.bannerList);
    router.get('/bannerForm', deignController.bannerForm);

    /* 팝업 관리 */
    router.get('/popupList', deignController.popupList);
    router.get('/popupForm', deignController.popupForm);

    return router;

};


