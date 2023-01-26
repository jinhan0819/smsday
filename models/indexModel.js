let db = require('../modules/db');
let config = require('../config');

module.exports = {
    getMemberInfo: async function(data){
        let sql = `
                    SELECT 
                        mb_name,
                        mb_hp,
                        id,
                        mb_email,
                        mb_point
                    from tb_member 
                    WHERE mb_index = ?
                `;
        // 쿼리를 하나만 처리할 때 사용
        let rslt = await db.queryTransaction(sql, [data.mb_index]);
        return rslt;
    },
    
}