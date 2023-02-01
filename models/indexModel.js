let db = require('../modules/db');
let config = require('../config');

module.exports = {
    getMemberInfo: async function(data){
        let sql = `
                    SELECT 
                        mb_name,
                        mb_hp,
                        mb_id,
                        mb_email,
                        mb_point
                    FROM TB_MEMBER 
                    WHERE index_no = ?
                `;
        // 쿼리를 하나만 처리할 때 사용
        let rslt = await db.queryTransaction(sql, [data.index_no]);
        return rslt;
    },
    
}