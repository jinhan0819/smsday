let config = require('../../config');
let deignModel = require('../../models/admin/deignModel');
let file = require('../../modules/file')

module.exports = {
    logoForm: function (req, res, next) {
        res.render('deign/logo_form');
    },
    bannerList: function (req, res, next) {
        res.render('deign/banner_list');
    },
    bannerForm: function (req, res, next) {
        res.render('deign/banner_form');
    },
    popupList: function (req, res, next) {
        res.render('deign/popup_list');
    },
    popupForm: function (req, res, next) {
        res.render('deign/popup_form');
    },
};
