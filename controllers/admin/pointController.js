let config = require('../../config');
let pointModel = require('../../models/admin/pointModel');
let file = require('../../modules/file');
let sess = require('../../modules/session');

module.exports = {
    /* 회원 Get 정보 */
    getMemberByPtId: async function (req, res, next) {
        let data = req.body;
        let rslt = await pointModel.getMemberByPtId(data);
        res.send(rslt);
    },

    /* 포인트 관리 - 포인트 정보 관리 */
    pointList: function (req, res, next) {
        res.render('point/point_list');
    },
    getMemberPointCount: async function (req, res, next) {
        let data = req.body;
        let rslt = await pointModel.getMemberPointCount(data);
        res.send(rslt);
    },
    getMemberPointList: async function (req, res, next) {
        let data = req.body;
        let rslt = await pointModel.getMemberPointList(data);
        res.send(rslt);
    },
    mbPointGiveInsert: async function (req, res, next) {
        let data = req.body;
        let pt_owner = sess.getPlain(req, 'memberInfo').mb_name;
        data.pt_owner = pt_owner;
        let rslt = await pointModel.mbPointGiveInsert(data);
        res.send(rslt);
    },
    
    // getMemberList: async function (req, res, next) {
    //     let data = req.body;
    //     let rslt = await memberModel.getMemberList(data);
    //     res.send(rslt);
    // },
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
    

    /* 포인트 관리 - 충전내역 관리 */
    pointChargeList: async function (req, res, next) {
        res.render('point/point_charge_list');
    },
    getPointChargeCount: async function (req, res, next) {
        let data = req.body;
        let rslt = await pointModel.getPointChargeCount(data);
        res.send(rslt);
    },
    getPointChargeList: async function (req, res, next) {
        let data = req.body;
        let rslt = await pointModel.getPointChargeList(data);
        res.send(rslt);
    },
    pointApprove: async function (req, res, next) {
        let data = req.body;
        let rslt = await pointModel.pointApprove(data);
        res.send(rslt);
    },
};
