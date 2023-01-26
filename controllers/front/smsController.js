let config = require('../../config');
let smsModel = require('../../models/front/smsModel');

module.exports = {
    sms_send: function (req, res, next) {
        res.render('sms/sms_send');
    },
    img_sms_send: function (req, res, next) {
        res.render('sms/img_sms_send');
    },
    large_sms_send: function (req, res, next) {
        res.render('sms/large_sms_send');
    },
};
