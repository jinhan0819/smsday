let config = require('../../config');
let deignModel = require('../../models/admin/deignModel');
let file = require('../../modules/file')
let sess = require('../../modules/session');

module.exports = {
    /* 로고 관리 */
    logoForm: function (req, res, next) {
        res.render('deign/logo_form');
    },

    /* 배너 관리 */
    bannerList: function (req, res, next) {
        res.render('deign/banner_list');
    },
    bannerForm: function (req, res, next) {
        res.render('deign/banner_form', {index_no : req.query.index_no});
    },
    bannerSave: async function (req, res, next) {
        let data    = req.body;
        let pt_id   = sess.getPlain(req, 'memberInfo').mb_id;
        data.pt_id  = pt_id;

        let rslt = await deignModel.bannerSave(data);
        res.send(rslt);
    },
    getBannerDetail: async function (req, res, next) {
        let data = req.body;
        let rslt = await deignModel.getBannerDetail(data);
        res.send(rslt);
    },
    getBannerCount: async function (req, res, next) {
        let data = req.body;
        let rslt = await deignModel.getBannerCount(data);
        res.send(rslt);
    },
    getBannerList: async function (req, res, next) {
        let data = req.body;
        let rslt = await deignModel.getBannerList(data);
        res.send(rslt);
    },

    /* 팝업 관리 */
    popupList: function (req, res, next) {
        res.render('deign/popup_list');
    },
    popupForm: function (req, res, next) {
        res.render('deign/popup_form');
    },
};
