let db = require('../../modules/db');
let config = require('../../config');

module.exports = {
    testDB: async function(params, callback){
        let sql = `
                    SELECT 
                        board_id,
                        title,
                        content,
                        regist_date,
                        views
                    from board 
                    WHERE board_id = ?`;
        // 쿼리를 하나만 처리할 때 사용
        let rslt = await db.queryTransaction(sql, params);

        callback(rslt);
    },
    
}
