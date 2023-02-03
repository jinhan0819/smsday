let config = require('../../config');
let partnerModel = require('../../models/admin/partnerModel');
let file = require('../../modules/file')

module.exports = {
    partnerList: function (req, res, next) {
        res.render('partner/partner_list');
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
