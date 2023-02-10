let db = require('../../modules/db');
let cipher = require('../../modules/cipher');
let config = require('../../config');
let paging = require('../../modules/pagination');
const file = require('../../modules/file');

module.exports = {
    getPartnerCount: async function(data){
        let search_sql = ``;
        if(typeof data.keycode !== 'undefined'){
            if(data.keycode == 'id') search_sql += `WHERE pt_id LIKE '%${data.keyword}%'`;
            else if(data.keycode == 'name') search_sql += `WHERE pt_owner LIKE '%${data.keyword}%'`;
        }

        
        if(typeof data.date !== 'undefined' && (data.date.start !== '' && data.date.end !== '')){
            if(search_sql === '') search_sql += 'WHERE'
            else search_sql += 'AND';
            search_sql += ` DATE_FORMAT(create_datetime, '%Y-%m-%d') BETWEEN '${data.date.start}' AND '${data.date.end}'`;
        }

        let sql = `
            SELECT
                COUNT(index_no) AS total_count
            FROM TB_PARTNER
            ${search_sql}
        `;
        let rslt = await db.queryTransaction(sql, []);

        return rslt;
    },
    getPartnerList: async function(data){
        let params = paging.pagingRange(data.paging);

        let search_sql = ``;
        if(typeof data.keycode !== 'undefined'){
            if(data.keycode == 'id') search_sql += `WHERE Z.pt_id LIKE '%${data.keyword}%'`;
            else if(data.keycode == 'name') search_sql += `WHERE Z.pt_owner LIKE '%${data.keyword}%'`;
        }

        
        if(typeof data.date !== 'undefined' && (data.date.start !== '' && data.date.end !== '')){
            if(search_sql === '') search_sql += 'WHERE'
            else search_sql += 'AND';
            search_sql += ` DATE_FORMAT(Z.create_datetime, '%Y-%m-%d') BETWEEN '${data.date.start}' AND '${data.date.end}'`;
        }

        let sql = `
            SELECT
                @ROWNUM := @ROWNUM + 1 AS rownum,
                Z.index_no,
                Z.pt_id,
                Z.pt_company_name,
                Z.pt_saupja,
                Z.pt_tongsin,
                IFNULL(Z.pt_domain, '-') AS pt_domain,
                Z.pt_tel,
                Z.pt_fax,
                Z.pt_item,
                Z.pt_service,
                Z.pt_owner,
                Z.pt_zip,
                Z.pt_addr,
                Z.pt_addr_detail,
                Z.pt_manager_name,
                Z.pt_manager_hp,
                Z.pt_manager_email,
                DATE_FORMAT(Z.create_datetime, '%Y-%m-%d') AS create_date
            FROM (
                SELECT
                    index_no,
                    pt_id,
                    pt_company_name,
                    pt_saupja,
                    pt_tongsin,
                    pt_domain,
                    pt_tel,
                    pt_fax,
                    pt_item,
                    pt_service,
                    pt_owner,
                    pt_zip,
                    pt_addr,
                    pt_addr_detail,
                    pt_manager_name,
                    pt_manager_hp,
                    pt_manager_email,
                    create_datetime
                FROM TB_PARTNER
            ) Z, (SELECT @ROWNUM := 0) R
            ${search_sql}
            ORDER BY rownum DESC 
            LIMIT ?, ? 
        `;
        let rslt = await db.queryTransaction(sql, params);

        return rslt;
    },
    getPartnerDetail: async function(data){
        let sql = `
            SELECT
                A.index_no,
                A.pt_id,
                A.pt_company_name,
                A.pt_saupja,
                A.pt_tongsin,
                A.pt_domain,
                A.pt_tel,
                A.pt_fax,
                A.pt_item,
                A.pt_service,
                A.pt_owner,
                A.pt_zip,
                A.pt_addr,
                A.pt_addr_detail,
                A.pt_manager_name,
                A.pt_manager_hp,
                A.pt_manager_email,
                A.pt_company_file_id,
                A.pt_manager_file_id,
                B.original_file_nm AS pt_company_file_nm,
                C.original_file_nm AS pt_manager_file_nm
            FROM TB_PARTNER A
            LEFT OUTER JOIN TB_ATCHM_FILE B ON (A.pt_company_file_id = B.index_no)
            LEFT OUTER JOIN TB_ATCHM_FILE C ON (A.pt_manager_file_id = C.index_no)
            WHERE A.index_no = ?
        `;
        let rslt = await db.queryTransaction(sql, [data.index_no]);

        return rslt;
    },
    partnerModify: async function(data) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        
        try{
            // 내용
            if(typeof data.index_no === 'undefined'){
                data.index_no = null;

                if(typeof data.pt_company_file_id === 'undefined') data.pt_company_file_id = null;
                if(typeof data.pt_manager_file_id === 'undefined') data.pt_manager_file_id = null;
            }else{
                // 파일 첨부가 사업자등록증 / 담당자신분증 두 개이므로 for문으로 2번 돌려서 처리
                let pt_file_arr = ['pt_company_file', 'pt_manager_file'];
                await pt_file_arr.reduce(async (pre, item, index) => {
                    return pre.then(async ()=> new Promise(async (resolve) => {
                        /* 
                            파일(사업자등록증 & 담당자신분증)을 변경할 경우 
                            1. 기존 파일 삭제
                            2. 기존 file table row 삭제 (새로 등록되었기 때문에)
                        */
                        if(typeof data[item+'_id'] !== 'undefined' || data[item+'_del']){
                            let file_sql = `
                                SELECT
                                    index_no,
                                    file_path
                                FROM TB_ATCHM_FILE
                                WHERE index_no = (
                                                    SELECT
                                                        ${item+'_id'}
                                                    FROM TB_PARTNER
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
                            let file_sel_sql = `
                                SELECT ${item+'_id'} FROM TB_PARTNER WHERE index_no = ?
                            `;
                            let result = await connection.query(file_sel_sql, data.index_no);
                            data[item+'_id'] = result[0][0][item+'_id'];
                        }
                        resolve();
                    }));
                }, Promise.resolve());
            }
    
            let col_datas = [
                // VALUES
                data.index_no, data.pt_id, data.pt_company_name, data.pt_saupja, data.pt_tongsin, data.pt_tel, data.pt_domain,
                data.pt_fax, data.pt_item, data.pt_service, data.pt_owner, data.pt_zip, data.pt_addr, data.pt_addr_detail,
                data.pt_manager_name, data.pt_manager_email, data.pt_manager_hp, data.pt_company_file_id, data.pt_manager_file_id,
                // UPDATE
                data.pt_id, data.pt_company_name, data.pt_saupja, data.pt_tongsin, data.pt_tel, data.pt_domain,
                data.pt_fax, data.pt_item, data.pt_service, data.pt_owner, data.pt_zip, data.pt_addr, data.pt_addr_detail,
                data.pt_manager_name, data.pt_manager_email, data.pt_manager_hp, data.pt_company_file_id, data.pt_manager_file_id
            ]
            let sql = `
                INSERT INTO TB_PARTNER (
                    index_no,
                    pt_id,
                    pt_company_name,
                    pt_saupja,
                    pt_tongsin,
                    pt_tel,
                    pt_domain,
                    pt_fax,
                    pt_item,
                    pt_service,
                    pt_owner,
                    pt_zip,
                    pt_addr,
                    pt_addr_detail,
                    pt_manager_name,
                    pt_manager_email,
                    pt_manager_hp,
                    pt_company_file_id,
                    pt_manager_file_id
                )
                VALUES(
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                ) 
                ON DUPLICATE KEY UPDATE
                pt_id = ?,
                pt_company_name = ?,
                pt_saupja = ?,
                pt_tongsin = ?,
                pt_tel = ?,
                pt_domain = ?,
                pt_fax = ?,
                pt_item = ?,
                pt_service = ?,
                pt_owner = ?,
                pt_zip = ?,
                pt_addr = ?,
                pt_addr_detail = ?,
                pt_manager_name = ?,
                pt_manager_email = ?,
                pt_manager_hp = ?,
                pt_company_file_id = ?,
                pt_manager_file_id = ?
            `;
            await connection.query(sql, col_datas)

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
    delPartner: async function(data){
        let result = {};
        try {
            await data.del_list.reduce(async (pre, item, index) => {
                return pre.then(async ()=> new Promise(async (resolve) => {
    
                    // 파일 여부 체크
                    let check_file_sql = 'SELECT pt_company_file_id, pt_manager_file_id FROM TB_PARTNER WHERE index_no = ?';
                    let check_rslt = await db.queryTransaction(check_file_sql, [item]);
    
                    // 사업자 등록 파일 삭제 및 DB 삭제
                    if(check_rslt.result[0].pt_company_file_id !== null){
                        let file_sql_1 = 'SELECT * FROM TB_ATCHM_FILE WHERE index_no = ?';
                        let file_rslt_1 = await db.queryTransaction(file_sql_1, [check_rslt.result[0].pt_company_file_id]);
                        try {
                            file.fileDelete(file_rslt_1.result[0].file_path);
                            let del_file_sql_1 = 'DELETE FROM TB_ATCHM_FILE WHERE index_no = ?'
                            await db.queryTransaction(del_file_sql_1, [check_rslt.result[0].pt_company_file_id]);
                        } catch (error) {
                            console.log('file delete error => ', error);
                        }
                    }
    
                    // 담당자 파일 삭제 및 DB 삭제
                    if(check_rslt.result[0].pt_manager_file_id !== null){
                        let file_sql_2 = 'SELECT * FROM TB_ATCHM_FILE WHERE index_no = ?';
                        let file_rslt_2 = await db.queryTransaction(file_sql_2, [check_rslt.result[0].pt_manager_file_id]);
                        try {
                            file.fileDelete(file_rslt_2.result[0].file_path);
                            let del_file_sql_2 = 'DELETE FROM TB_ATCHM_FILE WHERE index_no = ?'
                            await db.queryTransaction(del_file_sql_2, [check_rslt.result[0].pt_manager_file_id]);
                        } catch (error) {
                            console.log('file delete error => ', error);
                        }
                    }
    
                    let sql = `
                        DELETE FROM TB_PARTNER
                        WHERE index_no = ?
                    `;
                    await db.queryTransaction(sql, [item]);
                    result.code = 200;
                    result.message = 'file and data delete success';
                    resolve();
                }));
            }, Promise.resolve());
        } catch (error) {
            result.code = 500;
            result.message = 'file and data delete fail';
        }

        return result;
    },
    getPartnerChargeCount: async function(data){
        let search_sql = ``;
        if(typeof data.keycode !== 'undefined'){
            if(data.keycode == 'id') search_sql += `WHERE B.pt_id LIKE '%${data.keyword}%'`;
            else if(data.keycode == 'name') search_sql += `WHERE B.pt_owner LIKE '%${data.keyword}%'`;
        }
        
        if(typeof data.date !== 'undefined' && (data.date.start !== '' && data.date.end !== '')){
            if(search_sql === '') search_sql += 'WHERE'
            else search_sql += ' AND';
            search_sql += ` DATE_FORMAT(A.pf_request_datetime, '%Y-%m-%d') BETWEEN '${data.date.start}' AND '${data.date.end}'`;
        }

        if(typeof data.approve_yn !== 'undefined' && data.approve_yn !== ''){
            if(search_sql === '') search_sql += 'WHERE'
            else search_sql += ' AND';
            search_sql += ` A.pf_approval_yn = ${data.approve_yn}`;
        }

        let sql = `
            SELECT
                COUNT(A.index_no) AS total_count
            FROM TB_PARTNER_FEE A
            INNER JOIN TB_PARTNER B ON (A.pt_id = B.pt_id)
            ${search_sql}
        `;
        let rslt = await db.queryTransaction(sql, []);

        return rslt;
    },
    getPartnerChargeList: async function(data){
        let params = paging.pagingRange(data.paging);

        let search_sql = ``;
        if(typeof data.keycode !== 'undefined'){
            if(data.keycode == 'id') search_sql += `WHERE Z.pt_id LIKE '%${data.keyword}%'`;
            else if(data.keycode == 'name') search_sql += `WHERE Z.pt_owner LIKE '%${data.keyword}%'`;
        }
        
        if(typeof data.date !== 'undefined' && (data.date.start !== '' && data.date.end !== '')){
            if(search_sql === '') search_sql += 'WHERE'
            else search_sql += 'AND';
            search_sql += ` DATE_FORMAT(Z.pf_request_datetime, '%Y-%m-%d') BETWEEN '${data.date.start}' AND '${data.date.end}'`;
        }

        if(typeof data.approve_yn !== 'undefined' && data.approve_yn !== ''){
            if(search_sql === '') search_sql += 'WHERE'
            else search_sql += 'AND';
            search_sql += ` Z.pf_approval_yn = ${data.approve_yn}`;
        }

        let sql = `
            SELECT
                @ROWNUM := @ROWNUM + 1 AS rownum,
                Z.index_no,
                Z.pf_approval_yn,
                Z.pt_id,
                Z.pt_owner,
                Z.pt_company_name,
                IFNULL(Z.pt_domain, '-') AS pt_domain,
                Z.pf_contents,
                Z.pf_fee,
                DATE_FORMAT(Z.pf_request_datetime, '%Y-%m-%d %H:%i:%s') AS pf_request_datetime,
                IFNULL(DATE_FORMAT(Z.pf_approval_datetime, '%Y-%m-%d %H:%i:%s'), '-') AS pf_approval_datetime
            FROM (
                    SELECT
                        A.index_no,
                        A.pf_approval_yn,
                        B.pt_id,
                        B.pt_owner,
                        B.pt_company_name,
                        B.pt_domain,
                        A.pf_contents,
                        A.pf_fee,
                        A.pf_request_datetime,
                        A.pf_approval_datetime
                    FROM TB_PARTNER_FEE A
                    INNER JOIN TB_PARTNER B ON (A.pt_id = B.pt_id)
                    ORDER BY A.pf_approval_yn DESC, pf_request_datetime DESC
            ) Z, (SELECT @ROWNUM := 0) R
            ${search_sql}
            ORDER BY rownum DESC 
            LIMIT ?, ? 
        `;
        let rslt = await db.queryTransaction(sql, params);

        return rslt;
    },
    partnerApprove: async function(data){
        let sql = `
            UPDATE TB_PARTNER_FEE
            SET
                pf_approval_yn = 1,
                pf_approval_datetime = NOW()
            WHERE index_no IN (?)
        `;
        let rslt = await db.queryTransaction(sql, [data.aprv_list]);

        return rslt;
    }
}