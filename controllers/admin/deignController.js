let config = require('../../config');
let deignModel = require('../../models/admin/deignModel');
let file = require('../../modules/file')
let sess = require('../../modules/session');

module.exports = {
    /* 로고 관리 */
    logoForm: function (req, res, next) {
        res.render('deign/logo_form', {pt_id : sess.getPlain(req, 'memberInfo').mb_id});
    },
    logoSave: async function (req, res, next) {
        let data    = req.body;
        data.pt_id  = sess.getPlain(req, 'memberInfo').mb_id;

        let rslt = await deignModel.logoSave(data);
        res.send(rslt);
    },
    getLogoDetail: async function (req, res, next) {
        let data = req.body;
        let rslt = await deignModel.getLogoDetail(data);
        res.send(rslt);
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
        data.pt_id  = sess.getPlain(req, 'memberInfo').mb_id;

        let rslt = await deignModel.bannerSave(data);
        res.send(rslt);
    },
    bannerUpdate: async function (req, res, next) {
        let data = req.body;
        let rslt = await deignModel.bannerUpdate(data);
        res.send(rslt);
    },
    bannerDelete: async function (req, res, next) {
        let data = req.body;
        let rslt = await deignModel.bannerDelete(data);
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
    getBannerCountBySrch: async function (req, res, next) {
        let data = req.body;
        let rslt = await deignModel.getBannerCountBySrch(data);
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
