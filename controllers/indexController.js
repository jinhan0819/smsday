let config = require('../config');
let passport = require('../modules/passport')();
let sess = require('../modules/session');
let indexModel = require('../models/indexModel');
let file = require('../modules/file');

module.exports = {
    index: function (req, res, next) {
        res.redirect('/front')
    },
    doLogin: function (req, res, next) {
        passport.authenticate('local', (err, member, info) => {
            if (err) return next(err);
            if (!member) {
                console.log(member);
                // 로그인 실패시 다시 로그인 => return res.redirect(req.app.locals.__logToURL);
                return res.send({authenticate: false, member: member});
            }
            else {
                req.login(member, async (err) => {
                    sess.setPlain(req, 'auth', member.mb_level);
                    sess.setPlain(req, 'memberInfo', member);
                    
                    if (err) return next(err);
                    return res.send({authenticate: true, member: member});
                });
            }
        })(req, res, next);
    },
    doLogout: function (req, res) {
        sess.Clear(req, res);
        res.redirect('/');
    },
    getMemberInfo: async function (req, res, next) {
        let data = req.body;
        let result = await indexModel.getMemberInfo(data);
        res.send(result);
    },
    getMemberAllInfo: async function (req, res, next) {
        let data = req.body;
        let result = await indexModel.getMemberAllInfo(data);
        res.send(result);
    },
    fileUpload: function (req, res) {
        file.fileUpload(req, async (result) => {
            let rslt = await indexModel.insertAtchmFile(result);
            res.send(rslt);
        });
    },
    fileDownload: async function (req, res) {
        let data = req.query;
        let rslt = await indexModel.getAtchmFile(data);
        file.fileDownload(res, rslt.result[0]);
    }
};
