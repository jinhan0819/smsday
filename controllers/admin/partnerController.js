let config = require('../../config');
let partnerModel = require('../../models/admin/partnerModel');
let file = require('../../modules/file')

module.exports = {
    partnerList: function (req, res, next) {
        res.render('partner/partner_list');
    },
    getPartnerCount: async function (req, res, next) {
        let data = req.body;
        let rslt = await memberModel.getPartnerCount(data);
        res.send(rslt);
    },
    getPartnerList: async function (req, res, next) {
        let data = req.body;
        let rslt = await memberModel.getPartnerList(data);
        res.send(rslt);
    },
    // getMemberDetail: async function (req, res, next) {
    //     let data = req.body;
    //     let rslt = await memberModel.getMemberDetail(data);
    //     res.send(rslt);
    // },
    // memberModify: async function (req, res, next) {
    //     let data = req.body;
    //     let rslt = await memberModel.memberModify(data);
    //     res.send(rslt);
    // },
};
