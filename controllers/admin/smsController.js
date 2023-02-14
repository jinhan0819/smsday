let config = require('../../config');
let smsModel = require('../../models/admin/smsModel');
let file = require('../../modules/file');
let sess = require('../../modules/session');

module.exports = {
    /* 문자관리 */
    smsTemplate: function (req, res, next) {
        res.render('sms/sms_template');
    },
    cateInsert: async function (req, res, next) {
        let data = req.body;
        let rslt = await smsModel.cateInsert(data);
        res.send(rslt);
    },

    /* 문자내역관리 */
    smsLog: function (req, res, next) {
        res.render('sms/sms_log');
    },
};
