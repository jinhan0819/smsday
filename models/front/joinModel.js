let db = require('../../modules/db');
let config = require('../../config');
let cipher = require('../../modules/cipher');

module.exports = {
    id_check: async function(data){
        let sql = `
            select
                id
            from tb_member
            where id = ?
        `;
        // 쿼리를 하나만 처리할 때 사용
        let rslt = await db.queryTransaction(sql, [data.id]);

        let id_check = rslt.result.length > 0 ? true : false;
        let result = {check : id_check};
        return result;
    },
    signup: async function(data){
        data.password = await cipher.bcryptPass(data.password);

        let sql = `insert into tb_member set ?`;
        // 쿼리를 하나만 처리할 때 사용
        let rslt = await db.queryTransaction(sql, data);

        return rslt;
    },
    
}
