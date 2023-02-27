let db = require('../../modules/db');
let cipher = require('../../modules/cipher');
let config = require('../../config');
let paging = require('../../modules/pagination');

module.exports = {
    getMemberByPtId: async function(data){
        let sql = 'SELECT * FROM TB_MEMBER WHERE mb_id = ?';

        let rslt = await db.queryTransaction(sql, [data.mb_id]);
        return rslt;
    },
    /* 포인트관리 - 포인트 정보 관리 */
    getMemberPointCount: async function(data){
        let search_sql = ``;
        if(typeof data.keycode !== 'undefined'){
            if(data.keycode == 'id') search_sql += `AND mb_id LIKE '%${data.keyword}%'`;
            else if(data.keycode == 'name') search_sql += `AND mb_name LIKE '%${data.keyword}%'`;
        }
        
        let sql = `
            SELECT
                COUNT(index_no) AS total_count
            FROM TB_MEMBER
            WHERE mb_level != 10
            AND mb_del_yn = 0
            ${search_sql}
        `;
        let rslt = await db.queryTransaction(sql, []);

        return rslt;
    },
    getMemberPointList: async function(data){
        let params = paging.pagingRange(data.paging);

        let search_sql = ``;
        if(typeof data.keycode !== 'undefined'){
            if(data.keycode == 'id') search_sql += `WHERE Z.mb_id LIKE '%${data.keyword}%'`;
            else if(data.keycode == 'name') search_sql += `WHERE Z.mb_name LIKE '%${data.keyword}%'`;
        }
        
        let date_search_sql = ``;
        if(typeof data.date !== 'undefined' && (data.date.start !== '' && data.date.end !== '')){
            date_search_sql = `WHERE DATE_FORMAT(create_datetime, '%Y-%m-%d') BETWEEN '${data.date.start}' AND '${data.date.end}'`;
        }

        let sql = `
            SELECT
                @ROWNUM := @ROWNUM + 1 AS rownum,
                Z.index_no,
                Z.mb_id,
                Z.mb_name,
                IFNULL(Z.mb_point, 0) AS mb_point,
                CASE
                    WHEN Z.mb_level = 1 THEN '회원'
                    WHEN Z.mb_level = 2 THEN '가맹점'
                    WHEN Z.mb_level = 10 THEN '관리자'
                END AS mb_level_nm,
                Z.use_count,
                Z.total_use_count
            FROM (
                    SELECT
                        A.index_no,
                        A.mb_id,
                        A.mb_name,
                        A.mb_point,
                        A.mb_level,
                        IFNULL(B.use_count, 0) AS use_count,
                        IFNULL(C.total_use_count, 0) AS total_use_count
                    FROM TB_MEMBER A
                    LEFT OUTER JOIN (
                            SELECT
                                COUNT(index_no) AS use_count,
                                mb_id
                            FROM TB_SMS_LOG
                            ${date_search_sql}
                    ) B ON (A.mb_id = B.mb_id)
                    LEFT OUTER JOIN (
                            SELECT
                                COUNT(index_no) AS total_use_count,
                                mb_id
                            FROM TB_SMS_LOG
                    ) C ON (A.mb_id = C.mb_id)
                    WHERE A.mb_level != 10
                    AND A.mb_del_yn = 0
                    ORDER BY A.create_datetime
            ) Z, (SELECT @ROWNUM := 0) R
            ${search_sql}
            ORDER BY rownum DESC 
            LIMIT ?, ? 
        `;
        let rslt = await db.queryTransaction(sql, params);

        return rslt;
    },
    mbPointGiveInsert: async function(data){
        const connection = await db.getConnection();
        await connection.beginTransaction();
        
        try{
            let setData = {};
            setData.po_point = parseInt(data.po_point.replace(/,/g, ''));
            setData.po_depositor = data.pt_owner;
            setData.po_request_datetime = new Date();
            setData.po_approval_yn = 1;
            setData.po_approval_datetime = new Date();
            setData.po_contents = data.po_contents;
            setData.mb_id = data.mb_id;

            let sql = 'INSERT INTO TB_POINT SET ?';
            await connection.query(sql, setData);

            let sql_2 = `
                UPDATE TB_MEMBER
                SET
                    mb_point = mb_point + ?
                WHERE mb_id = ?
            `
            await connection.query(sql_2, [setData.po_point, setData.mb_id]);

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

    /* 포인트관리 - 충전내역 관리 */
    getPointChargeCount: async function(data){
        let search_sql = ``;
        if(typeof data.keycode !== 'undefined'){
            if(data.keycode == 'id') search_sql += `WHERE B.mb_id LIKE '%${data.keyword}%'`;
            else if(data.keycode == 'name') search_sql += `WHERE B.mb_name LIKE '%${data.keyword}%'`;
        }
        
        if(typeof data.date !== 'undefined' && (data.date.start !== '' && data.date.end !== '')){
            if(search_sql === '') search_sql += 'WHERE'
            else search_sql += ' AND';
            search_sql += ` DATE_FORMAT(A.po_request_datetime, '%Y-%m-%d') BETWEEN '${data.date.start}' AND '${data.date.end}'`;
        }

        if(typeof data.approve_yn !== 'undefined' && data.approve_yn !== ''){
            if(search_sql === '') search_sql += 'WHERE'
            else search_sql += ' AND';
            search_sql += ` A.po_approval_yn = ${data.approve_yn}`;
        }

        let sql = `
            SELECT
                COUNT(A.index_no) AS total_count
            FROM TB_POINT A
            INNER JOIN TB_MEMBER B ON (A.mb_id = B.mb_id)
            ${search_sql}
        `;
        let rslt = await db.queryTransaction(sql, []);

        return rslt;
    },
    getPointChargeList: async function(data){
        let params = paging.pagingRange(data.paging);

        let search_sql = ``;
        if(typeof data.keycode !== 'undefined'){
            if(data.keycode == 'id') search_sql += `WHERE Z.mb_id LIKE '%${data.keyword}%'`;
            else if(data.keycode == 'name') search_sql += `WHERE Z.mb_name LIKE '%${data.keyword}%'`;
        }
        
        if(typeof data.date !== 'undefined' && (data.date.start !== '' && data.date.end !== '')){
            if(search_sql === '') search_sql += 'WHERE'
            else search_sql += 'AND';
            search_sql += ` DATE_FORMAT(Z.po_request_datetime, '%Y-%m-%d') BETWEEN '${data.date.start}' AND '${data.date.end}'`;
        }

        if(typeof data.approve_yn !== 'undefined' && data.approve_yn !== ''){
            if(search_sql === '') search_sql += 'WHERE'
            else search_sql += 'AND';
            search_sql += ` Z.po_approval_yn = ${data.approve_yn}`;
        }

        let sql = `
            SELECT
                @ROWNUM := @ROWNUM + 1 AS rownum,
                Z.index_no,
                Z.po_approval_yn,
                Z.mb_id,
                Z.mb_name,
                Z.po_point,
                DATE_FORMAT(Z.po_request_datetime, '%Y-%m-%d %H:%i:%s') AS po_request_datetime,
                IFNULL(DATE_FORMAT(Z.po_approval_datetime, '%Y-%m-%d %H:%i:%s'), '-') AS po_approval_datetime
            FROM (
                    SELECT
                        A.index_no,
                        A.po_approval_yn,
                        B.mb_id,
                        B.mb_name,
                        A.po_point,
                        A.po_request_datetime,
                        A.po_approval_datetime
                    FROM TB_POINT A
                    INNER JOIN TB_MEMBER B ON (A.mb_id = B.mb_id)
                    ORDER BY A.po_approval_yn DESC, po_request_datetime
            ) Z, (SELECT @ROWNUM := 0) R
            ${search_sql}
            ORDER BY rownum DESC 
            LIMIT ?, ? 
        `;
        let rslt = await db.queryTransaction(sql, params);

        return rslt;
    },
    pointApprove: async function(data){
        const connection = await db.getConnection();
        await connection.beginTransaction();
        
        try{
            let sql = `
                UPDATE TB_POINT
                SET
                    po_approval_yn = 1,
                    po_approval_datetime = NOW()
                WHERE index_no IN (?)
            `;
    
            await connection.query(sql, [data.aprv_list]);

            await data.mb_list.reduce(async (pre, item, index) => {
                return pre.then(async ()=> new Promise(async (resolve) => {
                    let sql_2 = `
                        UPDATE TB_MEMBER
                        SET
                            mb_point = mb_point + ?
                        WHERE mb_id = ?
                    `;
                    await connection.query(sql_2, [parseInt(item.mb_point), item.mb_id]);
                    resolve();
                }));
            }, Promise.resolve());
            
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
    }
}