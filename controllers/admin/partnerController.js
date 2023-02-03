let config = require('../../config');
let partnerModel = require('../../models/admin/partnerModel');
let file = require('../../modules/file')

module.exports = {
    /* 가맹점 정보 관리 & 가맹점 신규신청*/
    partnerList: function (req, res, next) {
        res.render('partner/partner_list');
    },
    partnerForm: function (req, res, next) {
        res.render('partner/partner_form');
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
    
};
