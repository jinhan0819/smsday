let config = require('../../config');
let smsModel = require('../../models/admin/smsModel');
let file = require('../../modules/file');
let sess = require('../../modules/session');

module.exports = {
    smsTemplate: function (req, res, next) {
        res.render('sms/sms_template');
    },
    smsLog: function (req, res, next) {
        res.render('sms/sms_log');
    },
};
