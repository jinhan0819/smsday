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
        let pt_id = sess.getPlain(req, 'memberInfo').mb_id;
        data.pt_id = pt_id;
        let rslt = await smsModel.cateInsert(data);
        res.send(rslt);
    },
    cateDelete: async function (req, res, next) {
        let data = req.body;
        let rslt = await smsModel.cateDelete(data);
        res.send(rslt);
    },
    getCateList: async function (req, res, next) {
        let data = {};
        let pt_id = sess.getPlain(req, 'memberInfo').mb_id;
        data.pt_id = pt_id;
        let rslt = await smsModel.getCateList(data);
        res.send(rslt);
    },
    smsInsert: async function (req, res, next) {
        let data = req.body;
        let rslt = await smsModel.smsInsert(data);
        res.send(rslt);
    },
    smsUpdate: async function (req, res, next) {
        let data = req.body;
        let rslt = await smsModel.smsUpdate(data);
        res.send(rslt);
    },
    smsDelete: async function (req, res, next) {
        let data = req.body;
        let rslt = await smsModel.smsDelete(data);
        res.send(rslt);
    },
    getSmsCount: async function (req, res, next) {
        let data = req.body;
        let pt_id = sess.getPlain(req, 'memberInfo').mb_id;
        data.pt_id = pt_id;
        let rslt = await smsModel.getSmsCount(data);
        res.send(rslt);
    },
    getSmsHeaderCount: async function (req, res, next) {
        let data = req.body;
        let pt_id = sess.getPlain(req, 'memberInfo').mb_id;
        data.pt_id = pt_id;
        let rslt = await smsModel.getSmsHeaderCount(data);
        res.send(rslt);
    },
    getSmsList: async function (req, res, next) {
        let data = req.body;
        let pt_id = sess.getPlain(req, 'memberInfo').mb_id;
        data.pt_id = pt_id;
        let rslt = await smsModel.getSmsList(data);
        res.send(rslt);
    },

    /* 문자내역관리 */
    smsLog: function (req, res, next) {
        res.render('sms/sms_log');
    },
};
