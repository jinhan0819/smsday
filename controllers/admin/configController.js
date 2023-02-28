let config = require('../../config');
let configModel = require('../../models/admin/configModel');
let file = require('../../modules/file');
let sess = require('../../modules/session');

module.exports = {
    /* 기본환경설정 */
    configForm: function (req, res, next) {
        res.render('config/config_form', {pt_id : sess.getPlain(req, 'memberInfo').mb_id});
    },
    getConfigDetail: async function (req, res, next) {
        let data = req.body;
        let rslt = await configModel.getConfigDetail(data);
        res.send(rslt);
    },

    /* SMS설정 */
    configSmsForm: function (req, res, next) {
        res.render('config/config_sms_form');
    },
    
    /* SMS 충전신청 */
    ptSmsCharge: function (req, res, next) {
        res.render('config/pt_sms_charge');
    },
    getPtSmsChargeCount: async function (req, res, next) {
        let data = req.body;
        let rslt = await configModel.getPtSmsChargeCount(data);
        res.send(rslt);
    },
    getPtSmsChargeList: async function(req, res, next){
        let data = req.body;
        let rslt = await configModel.getPtSmsChargeList(data);
        res.send(rslt);
    },
    ptSmsInsert: async function(req, res, next){
        let data = req.body;
        let pt_id = sess.getPlain(req, 'memberInfo').mb_id;
        data.pt_id = pt_id;

        let rslt = await configModel.ptSmsInsert(data);
        res.send(rslt);
    },
    ptSmsDelete: async function(req, res, next){
        let data = req.body;
        let rslt = await configModel.ptSmsDelete(data);
        res.send(rslt);
    },

    /* 차단IP 설정 */
    ipAccess: function (req, res, next) {
        res.render('config/ip_access');
    },
};
