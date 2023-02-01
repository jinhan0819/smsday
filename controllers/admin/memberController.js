let config = require('../../config');
let memberModel = require('../../models/admin/memberModel');
let file = require('../../modules/file')

module.exports = {
    memberList: function (req, res, next) {
        res.render('member/member_list');
    },
    getMemberCount: async function (req, res, next) {
        let rslt = await memberModel.getMemberCount();
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
};
