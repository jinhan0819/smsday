let db = require('../../modules/db');
let cipher = require('../../modules/cipher');
let config = require('../../config');
let paging = require('../../modules/pagination');
const file = require('../../modules/file');

module.exports = {
    logoSave: async function(data) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        
        try{

            // 내용
            if(typeof data.index_no === 'undefined'){
                data.index_no = null;

                if(typeof data.logo_file_id === 'undefined') data.logo_file_id = null;
                if(typeof data.sns_logo_file_id === 'undefined') data.sns_logo_file_id = null;
                if(typeof data.favicon_file_id === 'undefined') data.favicon_file_id = null;
            } else {

                // 대표로고, SNS로고, 파비콘
                let logo_file_arr = ['logo_file', 'sns_logo_file', 'favicon_file'];
                await logo_file_arr.reduce(async (pre, item, index) => {
                    return pre.then(async ()=> new Promise(async (resolve) => {
                        /* 
                            파일(대표로고, SNS로고, 파비콘)을 변경할 경우 
                            1. 기존 파일 삭제
                            2. 기존 file table row 삭제 (새로 등록되었기 때문에)
                        */
                        if((typeof data[item+'_id'] !== 'undefined' || data[item+'_del']) && data.index_no != null) {
                            let file_sql = `
                                SELECT
                                    index_no,
                                    file_path
                                FROM TB_ATCHM_FILE
                                WHERE index_no = (
                                                    SELECT
                                                        ${item+'_id'}
                                                    FROM TB_LOGO    
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
                        } else {
                            if(data.index_no !== null){
                                let file_sel_sql = `
                                    SELECT ${item+'_id'} FROM TB_LOGO WHERE index_no = ?
                                `;
                                let result = await connection.query(file_sel_sql, data.index_no);
                                data[item+'_id'] = result[0][0][item+'_id'];
                            }
                        }
                        resolve();
                    }));
                }, Promise.resolve());
            }
    
            let col_datas = [
                // VALUES
                data.index_no, data.pt_id, data.logo_file_id, data.sns_logo_file_id, data.favicon_file_id,
                // UPDATE
                data.pt_id, data.logo_file_id, data.sns_logo_file_id, data.favicon_file_id
            ]
            let sql = `
                INSERT INTO TB_LOGO (
                    index_no,
                    pt_id,
                    logo_file_id,
                    sns_logo_file_id,
                    favicon_file_id
                )
                VALUES(
                    ?, ?, ?, ?, ?
                ) 
                ON DUPLICATE KEY UPDATE
                pt_id = ?,
                logo_file_id = ?,
                sns_logo_file_id = ?,
                favicon_file_id = ?
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
    getLogoDetail: async function(data) {
        let sql = `
            SELECT
                A.*,
                B.original_file_nm AS logo_file_nm,
                B.file_path AS logo_file_path,
                C.original_file_nm AS sns_logo_file_nm,
                C.file_path AS sns_logo_file_path,
                D.original_file_nm AS favicon_file_nm,
                D.file_path AS favicon_file_path
            FROM TB_LOGO A
            LEFT OUTER JOIN TB_ATCHM_FILE B ON (A.logo_file_id = B.index_no)  
            LEFT OUTER JOIN TB_ATCHM_FILE C ON (A.sns_logo_file_id = C.index_no)  
            LEFT OUTER JOIN TB_ATCHM_FILE D ON (A.favicon_file_id = D.index_no)  
            WHERE A.pt_id = ?
        `;
        let rslt = await db.queryTransaction(sql, [data.pt_id]);

        return rslt;
    },
    bannerSave: async function(data) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        
        try{
            // 내용
            if(typeof data.index_no === 'undefined') {
                data.index_no = null;

                if(typeof data.bn_file_id === 'undefined') data.bn_file_id = null;

            } else {
                /* 
                    1. 기존 파일 삭제
                    2. 기존 file table row 삭제 (새로 등록되었기 때문에)
                */
                if((typeof data['bn_file_id'] !== 'undefined' || data['bn_file_del']) && data.index_no != null) {
                    let file_sql = `
                        SELECT
                            index_no,
                            file_path
                        FROM TB_ATCHM_FILE
                        WHERE index_no = (
                                            SELECT
                                                bn_file_id
                                            FROM TB_BANNER
                                            WHERE index_no = ?
                                        )
                    `;
                    let result = await connection.query(file_sql, data.index_no);
                    if(result[0].length > 0) {
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
                } else {
                    if(data.index_no !== null){
                        let file_sel_sql = `
                            SELECT bn_file_id FROM TB_BANNER WHERE index_no = ?
                        `;
                        let result = await connection.query(file_sel_sql, data.index_no);
                        data['bn_file_id'] = result[0][0]['bn_file_id'];
                    }
                }
            }
    
            let col_datas = [
                // VALUES
                data.index_no, data.pt_id, data.bn_code, data.bn_file_id, data.bn_link, data.bn_target,
                data.bn_width, data.bn_height, data.bn_bg, data.bn_text, data.bn_use, data.bn_order,
                // UPDATE
                data.pt_id, data.bn_code, data.bn_file_id, data.bn_link, data.bn_target,
                data.bn_width, data.bn_height, data.bn_bg, data.bn_text, data.bn_use, data.bn_order,
            ]
            let sql = `
                INSERT INTO TB_BANNER (
                    index_no,
                    pt_id,
                    bn_code,
                    bn_file_id,
                    bn_link,
                    bn_target,
                    bn_width,
                    bn_height,
                    bn_bg,
                    bn_text,
                    bn_use,
                    bn_order
                )
                VALUES(
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                ) 
                ON DUPLICATE KEY UPDATE
                pt_id       = ?,
                bn_code     = ?,
                bn_file_id  = ?,
                bn_link     = ?,
                bn_target   = ?,
                bn_width    = ?,
                bn_height   = ?,
                bn_bg       = ?,
                bn_text     = ?,
                bn_use      = ?,
                bn_order    = ?
            `;
            await connection.query(sql, col_datas)

            await connection.commit();
                    
            let rslt = JSON.parse(JSON.stringify(config.suc_result));

            return rslt;
        } catch(e) {
            await connection.rollback();
            console.error('Transaction rollbacked ======>',e);
            let rslt = JSON.parse(JSON.stringify(config.err_result));
            rslt.message = e;
            return rslt;
        } finally {
            connection.release();
        }

        
    },
    bannerUpdate: async function(data){
        let result = {};
        try {
            await data.update_list.reduce(async (pre, item, index) => {
                return pre.then(async ()=> new Promise(async (resolve) => {
                    let sql = `
                        UPDATE TB_BANNER
                        SET
                            bn_link     = ?,
                            bn_target   = ?,
                            bn_width    = ?,
                            bn_height   = ?,
                            bn_use      = ?,
                            bn_order    = ?
                        WHERE index_no = ?
                    `;
                    await db.queryTransaction(sql, [item.bn_link, item.bn_target, item.bn_width, item.bn_height, item.bn_use, item.bn_order, item.index_no]);
                    result.code = 200;
                    result.message = 'data update success';
                    resolve();
                }));
            }, Promise.resolve());
        } catch (error) {
            result.code = 500;
            result.message = 'data update fail';
        }

        return result;
    },
    bannerDelete: async function(data){
        let result = {};
        try {
            await data.delte_list.reduce(async (pre, item, index) => {
                return pre.then(async ()=> new Promise(async (resolve) => {
    
                    // 파일 여부 체크
                    let check_file_sql = 'SELECT bn_file_id FROM TB_BANNER WHERE index_no = ?';
                    let check_rslt = await db.queryTransaction(check_file_sql, [item]);
    
                    // 배너 파일 삭제 및 DB 삭제
                    if(check_rslt.result[0].bn_file_id !== null){
                        let file_sql_1 = 'SELECT * FROM TB_ATCHM_FILE WHERE index_no = ?';
                        let file_rslt_1 = await db.queryTransaction(file_sql_1, [check_rslt.result[0].bn_file_id]);
                        try {
                            file.fileDelete(file_rslt_1.result[0].file_path);
                            let del_file_sql_1 = 'DELETE FROM TB_ATCHM_FILE WHERE index_no = ?'
                            await db.queryTransaction(del_file_sql_1, [check_rslt.result[0].bn_file_id]);
                        } catch (error) {
                            console.log('file delete error => ', error);
                        }
                    }
    
                    let sql = `
                        DELETE FROM TB_BANNER
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
    getBannerDetail: async function(data) {
        let sql = `
            SELECT
                A.*,
                B.original_file_nm AS bn_file_nm,
                B.file_path AS bn_file_path
            FROM TB_BANNER A
            LEFT OUTER JOIN TB_ATCHM_FILE B ON (A.bn_file_id = B.index_no)  
            WHERE A.index_no = ?
        `;
        let rslt = await db.queryTransaction(sql, [data.index_no]);

        return rslt;
    },
    getBannerCount: async function(data) {
        let search_sql = ``;
        if(typeof data.bnCode !== 'undefined' && data.bnCode !== '') {
            search_sql += ` AND bn_code = '${data.bnCode}' `;
        }

        let sql = `
            SELECT
                COUNT(index_no) AS total_count,
                (SELECT COUNT(*) FROM TB_BANNER WHERE bn_use = 1 ${search_sql}) AS vi_count,
                (SELECT COUNT(*) FROM TB_BANNER WHERE bn_use = 0 ${search_sql}) AS nvi_count
            FROM TB_BANNER
            WHERE 1=1
            ${search_sql}
        `;
        let rslt = await db.queryTransaction(sql, []);

        return rslt;
    },
    getBannerCountBySrch: async function(data) {
        let search_sql = ``;
        if(typeof data.bnCode !== 'undefined' && data.bnCode !== '') {
            search_sql += ` AND bn_code = '${data.bnCode}' `;
        }

        if(typeof data.bnUse !== 'undefined' && data.bnUse !== 2) {
            search_sql += ` AND bn_use = '${data.bnUse}' `;
        }

        let sql = `
            SELECT
                COUNT(index_no) AS total_count
            FROM TB_BANNER
            WHERE 1=1
            ${search_sql}
        `;
        let rslt = await db.queryTransaction(sql, []);

        return rslt;
    },
    getBannerList: async function(data) {
        let params = paging.pagingRange(data.paging);

        let search_sql = ``;
        if(typeof data.bnCode !== 'undefined' && data.bnCode !== '') {
            search_sql += ` AND bn_code = '${data.bnCode}' `;
        }

        if(typeof data.bnUse !== 'undefined' && data.bnUse !== 2) {
            search_sql += ` AND bn_use = '${data.bnUse}' `;
        }

        let sql = `
            SELECT
                @ROWNUM := @ROWNUM + 1 AS rownum,
                Z.index_no,
                Z.bn_code,
                Z.bn_file_id,
                Z.bn_link,
                Z.bn_target,
                Z.bn_width,
                Z.bn_height,
                Z.bn_use,
                Z.bn_order,
                DATE_FORMAT(Z.create_datetime, '%Y-%m-%d') AS create_date,
                Z.file_path AS bn_file_path
            FROM (
                SELECT
                    A.index_no,
                    A.bn_code,
                    A.bn_file_id,
                    A.bn_link,
                    A.bn_target,
                    A.bn_width,
                    A.bn_height,
                    A.bn_use,
                    A.bn_order,
                    A.create_datetime,
                    B.file_path
                FROM TB_BANNER A
                LEFT OUTER JOIN TB_ATCHM_FILE B ON (A.bn_file_id = B.index_no)  
            ) Z, (SELECT @ROWNUM := 0) R
            WHERE 1=1
            ${search_sql}
            ORDER BY rownum DESC 
            LIMIT ?, ? 
        `;
        let rslt = await db.queryTransaction(sql, params);

        return rslt;
    },

}