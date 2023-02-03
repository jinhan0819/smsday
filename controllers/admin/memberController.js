let config = require('../../config');
let memberModel = require('../../models/admin/memberModel');
let file = require('../../modules/file')

module.exports = {
    memberList: function (req, res, next) {
        res.render('member/member_list');
    },
    memberForm: function (req, res, next) {
        res.render('member/member_form');
    },
    getMemberCount: async function (req, res, next) {
        let data = req.body;
        let rslt = await memberModel.getMemberCount(data);
        res.send(rslt);
    },
    getMemberList: async function (req, res, next) {
        let data = req.body;
        let rslt = await memberModel.getMemberList(data);
        res.send(rslt);
    },
    getMemberDetail: async function (req, res, next) {
        let data = req.body;
        let rslt = await memberModel.getMemberDetail(data);
        res.send(rslt);
    },
    memberModify: async function (req, res, next) {
        let data = req.body;
        let rslt = await memberModel.memberModify(data);
        res.send(rslt);
    },
    getNotPartnerMemberCount: async function (req, res, next) {
        let data = req.body;
        let rslt = await memberModel.getNotPartnerMemberCount(data);
        res.send(rslt);
    },
    getNotPartnerMemberList: async function (req, res, next) {
        let data = req.body;
        let rslt = await memberModel.getNotPartnerMemberList(data);
        res.send(rslt);
    },
};
