let db = require('../../modules/db');
let cipher = require('../../modules/cipher');
let config = require('../../config');
let paging = require('../../modules/pagination');
let file = require('../../modules/file');

module.exports = {
    getMemberCount: async function(data){
        let search_sql = ``;
        if(typeof data.keycode !== 'undefined'){
            if(data.keycode == 'id') search_sql = `AND mb_id LIKE '%${data.keyword}%'`;
            else if(data.keycode == 'name') search_sql = `AND mb_name LIKE '%${data.keyword}%'`;
            else if(data.keycode == 'hp') search_sql = `AND mb_hp LIKE '%${data.keyword}%'`;
        }

        if(typeof data.date !== 'undefined' && (data.date.start !== '' && data.date.end !== '')){
            search_sql += `AND DATE_FORMAT(create_datetime, '%Y-%m-%d') BETWEEN '${data.date.start}' AND '${data.date.end}'`;
        }

        let sql = `
            SELECT
                COUNT(index_no) AS total_count
            FROM TB_MEMBER
            WHERE mb_level = 1
            AND mb_del_yn = 0
            ${search_sql}
        `;
        let rslt = await db.queryTransaction(sql, []);

        return rslt;
    },
    getMemberList: async function(data){
        let params = paging.pagingRange(data.paging);

        let search_sql = ``;
        if(typeof data.keycode !== 'undefined'){
            if(data.keycode == 'id') search_sql = `AND Z.mb_id LIKE '%${data.keyword}%'`;
            else if(data.keycode == 'name') search_sql = `AND Z.mb_name LIKE '%${data.keyword}%'`;
            else if(data.keycode == 'hp') search_sql = `AND Z.mb_hp LIKE '%${data.keyword}%'`;
        }

        if(typeof data.date !== 'undefined' && (data.date.start !== '' && data.date.end !== '')){
            search_sql += `AND DATE_FORMAT(Z.create_datetime, '%Y-%m-%d') BETWEEN '${data.date.start}' AND '${data.date.end}'`;
        }

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
                END AS mb_level_nm,
                DATE_FORMAT(Z.create_datetime, '%Y-%m-%d') AS create_date
            FROM (
                SELECT
                    index_no,
                    mb_id, 
                    -- mb_password, 
                    mb_name, 
                    mb_hp, 
                    mb_email,
                    mb_point,
                    mb_level,
                    mb_del_yn,
                    create_datetime
                FROM TB_MEMBER
                ORDER BY create_datetime
            ) Z, (SELECT @ROWNUM := 0) R
            WHERE mb_level = 1
            AND mb_del_yn = 0
            ${search_sql}
            ORDER BY rownum DESC 
            LIMIT ?, ? 
        `;
        let rslt = await db.queryTransaction(sql, params);

        return rslt;
    },
    getMemberDetail: async function(data){
        let sql = `
            SELECT
                A.index_no,
                A.mb_id, 
                -- mb_password, 
                A.mb_name, 
                A.mb_hp, 
                A.mb_email,
                A.mb_point,
                A.mb_level,
                A.mb_tlcm_file_id,
                B.original_file_nm AS mb_tlcm_file_nm
            FROM TB_MEMBER A
            LEFT OUTER JOIN TB_ATCHM_FILE B ON (A.mb_tlcm_file_id = B.index_no)  
            WHERE A.index_no = ?
        `;
        let rslt = await db.queryTransaction(sql, [data.index_no]);

        return rslt;
    },
    getMemberCallNum: async function(data){
        let sql = `
            SELECT
                cn_send_num,
                cn_send_memo, 
                cn_send_state
            FROM TB_CALL_NUM
            WHERE mb_id = ?
        `;
        let rslt = await db.queryTransaction(sql, [data.mb_id]);

        return rslt;
    },
    memberModify: async function(data) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        
        try{
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

            /* 
                파일(사업자등록증 & 담당자신분증)을 변경할 경우 
                1. 기존 파일 삭제
                2. 기존 file table row 삭제 (새로 등록되었기 때문에)
            */
            if((typeof data.mb_tlcm_file_id !== 'undefined' || data.tlc_file_del) && data.index_no != null){
                let file_sql = `
                    SELECT
                        index_no,
                        file_path
                    FROM TB_ATCHM_FILE
                    WHERE index_no = (
                                        SELECT
                                            mb_tlcm_file_id
                                        FROM TB_MEMBER
                                        WHERE index_no = ?
                                    )
                `;
                let result = await connection.query(file_sql, data.index_no);
                if(result[0].length > 0){
                    try {
                        file.fileDelete(result[0][0].file_path);
                    } catch (error) {
                        console.log('file delete error ==> ', error);
                    }

                    let file_del_sql = `DELETE FROM TB_ATCHM_FILE WHERE index_no = ?`;
                    await connection.query(file_del_sql, result[0][0].index_no);
                }
            /* 
                파일을 변경하지 않을 시
                1. 기존 파일 아이디 조회 후 파라미터에 값을 준다.
            */
            }else{
                if(data.index_no !== null){
                    let file_sel_sql = `
                        SELECT mb_tlcm_file_id FROM TB_MEMBER WHERE index_no = ?
                    `;
                    let result = await connection.query(file_sel_sql, data.index_no);
                    data.mb_tlcm_file_id = result[0][0].mb_tlcm_file_id;
                }
            }

            if(typeof data.mb_tlcm_file_id === 'undefined') data.mb_tlcm_file_id = null;

            let col_datas = [
                data.index_no, data.mb_id, data.mb_password, data.mb_name, data.mb_hp, data.mb_email, data.mb_level, data.mb_point, data.mb_tlcm_file_id,
                data.mb_password, data.mb_name, data.mb_hp, data.mb_email, data.mb_level, data.mb_point, data.mb_tlcm_file_id
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
                    mb_point,
                    mb_tlcm_file_id
                )
                VALUES(
                    ?, ?, ?, ?, ?, ?, ?, ?, ?
                ) 
                ON DUPLICATE KEY UPDATE
                mb_password = ?,
                mb_name = ?,
                mb_hp = ?,
                mb_email = ?,
                mb_level = ?,
                mb_point = ?,
                mb_tlcm_file_id = ?
            `;
            await connection.query(sql, col_datas)

            let call_del_sql =  `
                DELETE FROM TB_CALL_NUM WHERE mb_id = ?
            `;
            await connection.query(call_del_sql, [data.mb_id]);
            if(data.callnum.length > 0){

                await data.callnum.reduce(async (pre, item, index) => {
                    return pre.then(async ()=> new Promise(async (resolve) => {
                        item.mb_id = data.mb_id;
                        let call_sql =  `
                            INSERT INTO TB_CALL_NUM SET ?
                        `;
                        await connection.query(call_sql, item);
                        resolve();
                    }));
                }, Promise.resolve());
            }

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