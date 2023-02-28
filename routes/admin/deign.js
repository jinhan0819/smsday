let express = require('express');
let deignController = require('../../controllers/admin/deignController');

module.exports = function () {

    let router = express.Router();

    /* 로고 관리 */
    router.get('/logoForm', deignController.logoForm);
    router.post('/logoSave', deignController.logoSave);
    router.post('/getLogoDetail', deignController.getLogoDetail);

    /* 배너 관리 */
    router.get('/bannerList', deignController.bannerList);
    router.get('/bannerForm', deignController.bannerForm);
    router.post('/bannerSave', deignController.bannerSave);
    router.post('/bannerUpdate', deignController.bannerUpdate);
    router.post('/bannerDelete', deignController.bannerDelete);
    router.post('/getBannerDetail', deignController.getBannerDetail);
    router.post('/getBannerCount', deignController.getBannerCount);
    router.post('/getBannerCountBySrch', deignController.getBannerCountBySrch);
    router.post('/getBannerList', deignController.getBannerList);

    /* 팝업 관리 */
    router.get('/popupList', deignController.popupList);
    router.get('/popupForm', deignController.popupForm);

    return router;


};


