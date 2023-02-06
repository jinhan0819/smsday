let config = require('../../config');
let deignModel = require('../../models/admin/deignModel');
let file = require('../../modules/file')

module.exports = {
    logoList: function (req, res, next) {
        res.render('deign/logo_list');
    },
    bannerList: function (req, res, next) {
        res.render('deign/banner_list');
    },
    popupList: function (req, res, next) {
        res.render('deign/popup_list');
    },
};
