let db = require('../../modules/db');
let config = require('../../config');
let cipher = require('../../modules/cipher');

module.exports = {
    /* 내정보변경 */
    memberUpdate: async function(data){
        let sql = `
            UPDATE TB_MEMBER
            SET
                mb_name = ?,
                mb_hp = ?,
                mb_email = ?
            WHERE mb_id = ?
        `;
        // 쿼리를 하나만 처리할 때 사용
        let rslt = await db.queryTransaction(sql, [data.mb_name, data.mb_hp, data.mb_email, data.mb_id]);

        return rslt;
    },
    
    /* 패스워드 변경 */
    passwordUpdate: async function(data){
        data.mb_new_password = await cipher.bcryptPass(data.mb_new_password);

        let sql = `
            UPDATE TB_MEMBER
            SET
                mb_password = ?
            WHERE mb_id = ?
        `;
        // 쿼리를 하나만 처리할 때 사용
        let rslt = await db.queryTransaction(sql, [data.mb_new_password, data.mb_id]);

        return rslt;
    },
    
}
