let db = require('../../modules/db');
let cipher = require('../../modules/cipher');
let config = require('../../config');
let paging = require('../../modules/pagination');

module.exports = {
    getMemberCount: async function(data){
        let sql = `
            SELECT
                COUNT(index_no) AS total_count
            FROM TB_MEMBER
            WHERE (mb_id LIKE '%${data.keyword}%' OR mb_name LIKE '%${data.keyword}%' OR mb_email LIKE '%${data.keyword}%')
            AND mb_level = 1
        `;
        let rslt = await db.queryTransaction(sql, []);

        return rslt;
    },
    getMemberList: async function(data){
        let params = paging.pagingRange(data.paging);

        let sql = `
            SELECT
                @ROWNUM := @ROWNUM + 1 AS rownum,
                Z.index_no,
                Z.mb_id,
                Z.mb_name, 
                IFNULL(Z.mb_hp, '-') AS mb_hp,
                IFNULL(Z.mb_email, '-') AS mb_email,
                Z.mb_point,
                Z.mb_level,
                CASE
                    WHEN mb_level = 1 THEN '회원'
                    WHEN mb_level = 2 THEN '가맹점'
                    WHEN mb_level = 10 THEN '관리자'
                END AS mb_level_nm
            FROM (
                SELECT
                    index_no,
                    mb_id, 
                    -- mb_password, 
                    mb_name, 
                    mb_hp, 
                    mb_email,
                    mb_point,
                    mb_level
                FROM TB_MEMBER
            ) Z, (SELECT @ROWNUM := 0) R
            WHERE (mb_id LIKE '%${data.keyword}%' OR mb_name LIKE '%${data.keyword}%' OR mb_email LIKE '%${data.keyword}%')
            AND mb_level = 1
            ORDER BY rownum DESC 
            LIMIT ?, ? 
        `;
        let rslt = await db.queryTransaction(sql, params);

        return rslt;
    },
    getMemberDetail: async function(data){
        let sql = `
            SELECT
                index_no,
                mb_id, 
                -- mb_password, 
                mb_name, 
                mb_hp, 
                mb_email,
                mb_point,
                mb_level
            FROM TB_MEMBER
            WHERE index_no = ?
        `;
        let rslt = await db.queryTransaction(sql, [data.index_no]);

        return rslt;
    },
    memberModify: async function(data) {

        if(data.index_no === null){
            data.mb_password = await cipher.bcryptPass(data.mb_password);
        }else{
            if(data.mb_password === ''){
                let sel_sql = `SELECT mb_password FROM TB_MEMBER WHERE index_no = ?`;
                let sel_rslt = await db.queryTransaction(sel_sql, [data.index_no]);
                data.mb_password = sel_rslt.result[0].mb_password;
            }else{
                data.mb_password = await cipher.bcryptPass(data.mb_password);
            }
        }

        let col_datas = [
            data.index_no, data.mb_id, data.mb_password, data.mb_name, data.mb_hp, data.mb_email, data.mb_level, data.mb_point,
            data.mb_password, data.mb_name, data.mb_hp, data.mb_email, data.mb_level, data.mb_point
        ]
        let sql = `
            INSERT INTO TB_MEMBER (
                index_no,
                mb_id, 
                mb_password, 
                mb_name, 
                mb_hp, 
                mb_email,
                mb_level,
                mb_point
            )
            VALUES(
                ?, ?, ?, ?, ?, ?, ?, ?
            ) 
            ON DUPLICATE KEY UPDATE
            mb_password = ?,
            mb_name = ?,
            mb_hp = ?,
            mb_email = ?,
            mb_level = ?,
            mb_point = ?
        `;
        let rslt = await db.queryTransaction(sql, col_datas);

        return rslt;
    },
    getNotPartnerMemberCount: async function(data){
        let sql = `
            SELECT
                COUNT(A.index_no) AS total_count
            FROM TB_MEMBER A
            LEFT JOIN TB_PARTNER B ON (A.mb_id = B.pt_id)
            WHERE (A.mb_id LIKE '%${data.keyword}%' OR A.mb_name LIKE '%${data.keyword}%' OR A.mb_email LIKE '%${data.keyword}%')
            AND mb_level = 1
            AND B.pt_id IS NULL
        `;
        let rslt = await db.queryTransaction(sql, []);

        return rslt;
    },
    getNotPartnerMemberList: async function(data){
        let params = paging.pagingRange(data.paging);

        let sql = `
            SELECT
                @ROWNUM := @ROWNUM + 1 AS rownum,
                Z.index_no,
                Z.mb_id,
                Z.mb_name, 
                IFNULL(Z.mb_hp, '-') AS mb_hp,
                IFNULL(Z.mb_email, '-') AS mb_email,
                Z.mb_point,
                Z.mb_level,
                CASE
                    WHEN mb_level = 1 THEN '회원'
                    WHEN mb_level = 2 THEN '가맹점'
                    WHEN mb_level = 10 THEN '관리자'
                END AS mb_level_nm
            FROM (
                SELECT
                    index_no,
                    mb_id, 
                    -- mb_password, 
                    mb_name, 
                    mb_hp, 
                    mb_email,
                    mb_point,
                    mb_level
                FROM TB_MEMBER
            ) Z
            LEFT JOIN TB_PARTNER X ON (Z.mb_id = X.pt_id)
            , (SELECT @ROWNUM := 0) R
            WHERE (Z.mb_id LIKE '%${data.keyword}%' OR Z.mb_name LIKE '%${data.keyword}%' OR Z.mb_email LIKE '%${data.keyword}%')
            AND Z.mb_level = 1
            AND X.pt_id IS NULL
            ORDER BY rownum DESC
            LIMIT ?, ?
        `;
        let rslt = await db.queryTransaction(sql, params);

        return rslt;
    },
}