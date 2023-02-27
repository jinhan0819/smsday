let config = require('../../config');
let sess = require('../../modules/session');
let cipher = require('../../modules/cipher');
let mypageModel = require('../../models/front/mypageModel');
let indexModel = require('../../models/indexModel');

module.exports = {
    member_modify: function (req, res, next) {
        res.render('mypage/member_modify');
    },
    setting: function (req, res, next) {
        res.render('mypage/setting');
    },
    pwd_change: function (req, res, next) {
        res.render('mypage/pwd_change');
    },
    tel_modify: function (req, res, next) {
        res.render('mypage/tel_modify');
    },
    member_delete: function (req, res, next) {
        res.render('mypage/member_delete');
    },

    /* 내정보변경 */
    memberCheck: async function(req, res){
        let data = req.body;
        let memberInfo = sess.getPlain(req, 'memberInfo');
        data.mb_id = memberInfo.mb_id;

        let checkPassword = await cipher.chkBcryptPassAsync(data.mb_password, memberInfo.mb_password);
        // let rslt = await mypageModel.memberCheck(data);

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        if(!checkPassword){
            res.write("<script>alert('비밀번호가 틀립니다. 다시 시도해주세요.');</script>");
            res.write("<script>window.location=\"/front/mypage/member_modify\"</script>");
        }else{
            res.write("<script>window.location=\"/front/mypage/setting\"</script>");
        }
    },
    memberUpdate: async function(req, res){
        let data = req.body;
        let memberInfo = sess.getPlain(req, 'memberInfo');
        data.mb_id = memberInfo.mb_id;
        data.index_no = memberInfo.index_no;

        let rslt = await mypageModel.memberUpdate(data);

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        if(rslt.code == 200){
            res.write("<script>alert('회원정보 수정이 완료되었습니다.');</script>");
            res.write("<script>window.location=\"/front/\"</script>");
        }else{
            res.write("<script>alert('회원 정보 수정 중 오류가 발생하였습니다.');</script>");
            res.write("<script>window.location=\"/front/mypage/setting\"</script>");
        }
    },

    /* 패스워드 변경 */
    passwordUpdate: async function(req, res){
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

        let data = req.body;
        let memberInfo = sess.getPlain(req, 'memberInfo');
        data.mb_id = memberInfo.mb_id;
        data.index_no = memberInfo.index_no;

        let checkPassword = await cipher.chkBcryptPassAsync(data.mb_password, memberInfo.mb_password);

        if(!checkPassword){
            res.write("<script>alert('현재 비밀번호가 틀립니다.');</script>");
            res.write("<script>window.location=\"/front/mypage/pwd_change\"</script>");
        }else{
            let rslt = await mypageModel.passwordUpdate(data);

            if(rslt.code == 200){
                res.write("<script>alert('비밀번호 수정이 완료되었습니다.');</script>");
            }else{
                res.write("<script>alert('비밀번호 수정 중 오류가 발생하였습니다.');</script>");
            }
            
            res.write("<script>window.location=\"/front/\"</script>");

        }
    },
    memberWithdrawal: async function(req, res){
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

        let data = req.body;
        let memberInfo = sess.getPlain(req, 'memberInfo');
        data.mb_id = memberInfo.mb_id;
        data.index_no = memberInfo.index_no;

        let checkPassword = await cipher.chkBcryptPassAsync(data.mb_password, memberInfo.mb_password);

        if(!checkPassword){
            res.write("<script>alert('비밀번호가 틀립니다.');</script>");
            res.write("<script>window.location=\"/front/mypage/member_delete\"</script>");
        }else{
            let rslt = await mypageModel.memberWithdrawal(data);
            if(rslt.code == 200){
                res.write("<script>alert('회원 탈퇴가 완료되었습니다.');</script>");
            }else{
                res.write("<script>alert('회원 탈퇴 중 오류가 발생하였습니다.');</script>");
            }
            
            // sess.Clear();
            res.write("<script>window.location=\"/doLogout/\"</script>");

        }
    },
};
