let express = require('express');
let mypageController = require('../../controllers/front/mypageController');


module.exports = function () {

    let router = express.Router();

    router.get('/member_modify', mypageController.member_modify);
    router.get('/setting', mypageController.setting);
    router.get('/pwd_change', mypageController.pwd_change);
    router.get('/tel_modify', mypageController.tel_modify);
    router.get('/member_delete', mypageController.member_delete);

    /* 내정보변경 */
    router.post('/memberCheck', mypageController.memberCheck);
    router.post('/memberUpdate', mypageController.memberUpdate);
    
    /* 패스워드 변경 */
    router.post('/passwordUpdate', mypageController.passwordUpdate);

    /* 회원탈퇴 */
    router.post('/memberWithdrawal', mypageController.memberWithdrawal);

    return router;

};


