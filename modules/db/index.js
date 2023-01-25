// let mysql = require('mysql');
let mysql = require('mysql2/promise');
let config = require('../../config');
let cnn_pool;
if (process.env.NODE_ENV == 'production') {
    cnn_pool = mysql.createPool(config.connection_MYSQL.pro);
} else {
    cnn_pool = mysql.createPool(config.connection_MYSQL.dev);
}

function getConnection() {
    return cnn_pool.getConnection(async conn => conn);
}

/**
 * basic query
 * @param sql
 * @param callback
 */
function query(sql, callback) {
    queryPromise(sql)
    .then(result => {
        callback(result);
    }).catch(err => {
        // ... error checks
        console.error(`@Database SQL error. err-[${err}], sql-[${sql}]`);
    });
}

// mysql 방식
function queryStringPromise(sql){
    console.log(`sql=>${sql}`);
    return new Promise(function(resolve, reject){
        cnn_pool.query(sql, function(err, rslt, fields){
            if(err){
                reject(err)
            }else{
                // console.log(`sql=>${sql}`);
                resolve(rslt);
            }
        })
    });
}

function queryParamsPromise(sql, params){
    console.log(`sql=>${sql}`);
    return new Promise(function(resolve, reject){
        cnn_pool.query(sql, params ,function(err, rslt, fields){
            if(err){
                reject(err)
            }else{
                // console.log(`sql=>${sql}`);
                resolve(rslt);
            }
        })
    });
}

// Ex)
// sql => 'select * from user where user_id = ? and admin_yn = ?'
// params => ['admin', 'Y'] (Array)
async function queryTransaction(sql, params) {
    // ++++++++++++++++++++++++++++++++ [connection 시작] +++++++++++++++++++++++++++++++
    const connection = await getConnection();

    // =========================== [Transaction 시작] ===========================
    await connection.beginTransaction();
    
    try{
        let result = await connection.query(sql, params);
        console.log('sql ==> ', sql);
        // console.log('result ==>', result[0]);
        if( result.affectedRows<=0 ){
            // 비정상 처리
            throw new Error('SQL Invalid');
        }

        // 정상 처리
        // =========================== [Transaction commit]
        await connection.commit();
        let suc_result = JSON.parse(JSON.stringify(config.suc_result));
        suc_result.result = result[0];
        return suc_result;

    }catch(e){
        // =========================== [Transaction rollback]
        await connection.rollback();
        // error 처리
        console.error('Transaction rollbacked ======>',e);
        let err_result = JSON.parse(JSON.stringify(config.err_result));
        err_result.message = e.message
        return err_result;
    }finally{
        connection.release();
    }
    
}

// function connection() {
//     return mysql_pool;
// }

function connectionClose() {
    mysql_pool.close();
}

module.exports = {
    getConnection: getConnection,
    query: query,
    queryStringPromise: queryStringPromise,
    queryParamsPromise: queryParamsPromise,
    queryTransaction: queryTransaction
};


