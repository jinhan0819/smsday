let db = require('../../modules/db');
let cipher = require('../../modules/cipher');
let config = require('../../config');
let paging = require('../../modules/pagination');

module.exports = {
    cateInsert: async function(data){
        let sql = 'INSERT INTO TB_SMS_CATE SET ?';
        let rslt = await db.queryTransaction(sql, data);

        return rslt;
    },
    cateDelete: async function(data){
        const connection = await db.getConnection();
        await connection.beginTransaction();
        
        try{
            // 내용
            let sql = 'DELETE FROM TB_SMS_TEMPLATE WHERE cate_index_no = ?';
            await connection.query(sql, [data.index_no]);

            let sql_2 = 'DELETE FROM TB_SMS_CATE WHERE index_no = ?';
            await connection.query(sql_2, [data.index_no]);
            
            await connection.commit();
            let rslt = JSON.parse(JSON.stringify(config.suc_result));
            return rslt;
        }catch(e){
            await connection.rollback();
            console.error('Transaction rollbacked ======>',e);
            let rslt = JSON.parse(JSON.stringify(config.err_result));
            rslt.message = e;
            return rslt;
        }finally{
            connection.release();
        }
    },
    getCateList: async function(data){
        let sql = `
                SELECT 
                    *
                FROM TB_SMS_CATE
                WHERE pt_id = ?
                ORDER BY index_no
        `;
        let rslt = await db.queryTransaction(sql, [data.pt_id]);
        return rslt;
    },
    smsInsert: async function(data){
        let sql = `INSERT INTO TB_SMS_TEMPLATE SET ?`;
        let rslt = await db.queryTransaction(sql, data);
        return rslt;
    },
    smsUpdate: async function(data){
        let sql = `
            UPDATE TB_SMS_TEMPLATE
            SET
                st_text = ?
            WHERE index_no = ?
        `;
        let rslt = await db.queryTransaction(sql, [data.st_text, data.index_no]);
        return rslt;
    },
    smsDelete: async function(data){
        let sql = `
            DELETE FROM TB_SMS_TEMPLATE
            WHERE index_no = ?
        `;
        let rslt = await db.queryTransaction(sql, [data.index_no]);
        return rslt;
    },
    getSmsCount: async function(data){
        let search_sql = '';
        if(typeof data.cate_index_no !== 'undefined' && data.cate_index_no !== ''){
            search_sql = `AND A.cate_index_no = ${data.cate_index_no}`
        }

        let sql = `
            SELECT
                COUNT(A.index_no) AS total_count
            FROM TB_SMS_TEMPLATE A
            INNER JOIN TB_SMS_CATE B ON (A.cate_index_no = B.index_no)
            WHERE B.pt_id = ?
            ${search_sql}
        `;
        let rslt = await db.queryTransaction(sql, [data.pt_id]);
        return rslt;
    },
    getSmsHeaderCount: async function(data){
        
        let sql = `
            SELECT
                Z.cate_count,
                IFNULL(Z.cate_index_no, Z.index_no) AS cate_index_no,
                Z.sc_catename
            FROM (
                    SELECT
                        COUNT(B.cate_index_no) AS cate_count,
                        B.cate_index_no,
                        A.index_no,
                        A.sc_catename
                    FROM  TB_SMS_CATE A
                    LEFT OUTER JOIN TB_SMS_TEMPLATE B ON (A.index_no = B.cate_index_no)
                    WHERE A.pt_id = ?
                    GROUP BY B.cate_index_no
            ) Z
        `;
        let rslt = await db.queryTransaction(sql, [data.pt_id]);
        return rslt;
    },
    getSmsList: async function(data){
        let params = paging.pagingRange(data.paging);

        let search_sql = '';
        if(typeof data.cate_index_no !== 'undefined' && data.cate_index_no !== ''){
            search_sql = `AND A.cate_index_no = ${data.cate_index_no}`
        }

        let sql = `
                SELECT
                    @ROWNUM := @ROWNUM + 1 AS rownum,
                    Z.index_no,
                    Z.cate_index_no,
                    Z.st_text
                FROM (
                    SELECT
                        A.index_no,
                        A.cate_index_no,
                        A.st_text
                    FROM TB_SMS_TEMPLATE A
                    INNER JOIN TB_SMS_CATE B ON (A.cate_index_no = B.index_no)
                    WHERE B.pt_id = '${data.pt_id}'
                    ${search_sql}
                    ORDER BY A.index_no
                ) Z, (SELECT @ROWNUM := 0) R
                ORDER BY rownum DESC 
                LIMIT ?, ? 
        `;
        let rslt = await db.queryTransaction(sql, params);
        return rslt;
    },
}