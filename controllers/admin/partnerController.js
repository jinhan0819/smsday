let config = require('../../config');
let partnerModel = require('../../models/admin/partnerModel');
let file = require('../../modules/file')

module.exports = {
    /* 가맹점 Get 정보 */
    getPartnerByPtId: async function (req, res, next) {
        let data = req.body;
        let rslt = await partnerModel.getPartnerByPtId(data);
        res.send(rslt);
    },

    /* 가맹점 정보 관리 & 가맹점 신규신청*/
    partnerList: function (req, res, next) {
        res.render('partner/partner_list');
    },
    partnerForm: function (req, res, next) {
        res.render('partner/partner_form', {index_no : req.query.index_no});
    },
    getPartnerCount: async function (req, res, next) {
        let data = req.body;
        let rslt = await partnerModel.getPartnerCount(data);
        res.send(rslt);
    },
    getPartnerList: async function (req, res, next) {
        let data = req.body;
        let rslt = await partnerModel.getPartnerList(data);
        res.send(rslt);
    },
    getPartnerDetail: async function (req, res, next) {
        let data = req.body;
        let rslt = await partnerModel.getPartnerDetail(data);
        res.send(rslt);
    },
    partnerModify: async function (req, res, next) {
        let data = req.body;
        let rslt = await partnerModel.partnerModify(data);
        res.send(rslt);
    },
    delPartner: async function (req, res, next) {
        let data = req.body;
        let rslt = await partnerModel.delPartner(data);
        res.send(rslt);
    },

    /* 가맹점 사용관리 */
    partnerFeeList: function (req, res, next) {
        res.render('partner/partner_fee_list');
    },
    getPartnerFeeCount: async function (req, res, next) {
        let data = req.body;
        let rslt = await partnerModel.getPartnerFeeCount(data);
        res.send(rslt);
    },
    getPartnerFeeList: async function (req, res, next) {
        let data = req.body;
        let rslt = await partnerModel.getPartnerFeeList(data);
        res.send(rslt);
    },
    ptFeeGiveInsert: async function (req, res, next) {
        let data = req.body;
        let rslt = await partnerModel.ptFeeGiveInsert(data);
        res.send(rslt);
    },

    /* 가맹점 충전관리 */
    partnerChargeList: function (req, res, next) {
        res.render('partner/partner_charge_list');
    },
    getPartnerChargeCount: async function (req, res, next) {
        let data = req.body;
        let rslt = await partnerModel.getPartnerChargeCount(data);
        res.send(rslt);
    },
    getPartnerChargeList: async function (req, res, next) {
        let data = req.body;
        let rslt = await partnerModel.getPartnerChargeList(data);
        res.send(rslt);
    },
    partnerApprove: async function (req, res, next) {
        let data = req.body;
        let rslt = await partnerModel.partnerApprove(data);
        res.send(rslt);
    },
    
};
