let config = require('../../config');
let deignModel = require('../../models/admin/deignModel');
let file = require('../../modules/file')

module.exports = {
    bannerList: function (req, res, next) {
        res.render('deign/banner_list');
    },
    logoForm: function (req, res, next) {
        res.render('deign/logo_form');
    },
    popupList: function (req, res, next) {
        res.render('deign/popup_list');
    },
};
