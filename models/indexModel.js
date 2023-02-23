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
    getMemberAllInfo: async function(data){
        let sql = `
                    SELECT 
                        *
                    FROM TB_MEMBER 
                    WHERE index_no = ?
                `;
        // 쿼리를 하나만 처리할 때 사용
        let rslt = await db.queryTransaction(sql, [data.index_no]);
        return rslt;
    },
    getAtchmFile: async function(data){
        let sql = `SELECT * FROM TB_ATCHM_FILE WHERE index_no = ?`;
        // 쿼리를 하나만 처리할 때 사용
        let rslt = await db.queryTransaction(sql, data.index_no);
        return rslt;
    },
    insertAtchmFile: async function(data){
        let sql = `INSERT INTO TB_ATCHM_FILE SET ?`;
        // 쿼리를 하나만 처리할 때 사용
        let rslt = await db.queryTransaction(sql, data.file);
        return rslt;
    },
    
}