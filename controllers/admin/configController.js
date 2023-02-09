let config = require('../../config');
let configModel = require('../../models/admin/configModel');
let file = require('../../modules/file')

module.exports = {
    configForm: function (req, res, next) {
        res.render('config/config_form');
    },
    configSmsForm: function (req, res, next) {
        res.render('config/config_sms_form');
    },
    ptChargeForm: function (req, res, next) {
        res.render('config/pt_charge_form');
    },
    ipAccess: function (req, res, next) {
        res.render('config/ip_access');
    },
};