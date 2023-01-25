let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let db = require('../db');
let cipher = require('../cipher');
let config = require('../../config');
// let kakao = require('./kakaoStrategy');
// let naver = require('./naverStrategy');
// let google = require('./googleStrategy');

module.exports = () => {

    // kakao(); // 카카오 로그인
    // naver(); // 네이버 로그인
    // google(); // 구글 로그인

    // var isAuthenticated = function (req, res, next) {
    //     if (req.isAuthenticated())
    //       return next();
    //     res.redirect('/login');
    // };
    // isAuthenticated();

    passport.serializeUser((serializedUser, done) => {
        // console.log('serializeUser: ', serializedUser);
        // 세션에 사용자 정보 전체를 저장
        done(null, serializedUser);
    });

    passport.deserializeUser((deserializedId, done) => {
        // console.log('deserializeUser: ', deserializedId);
        // serialize 에서 저장한 값 반환
        done(null, deserializedId);
    });

    passport.use(new LocalStrategy({
            // Login Control 의 ID, PASS 값 매핑
            usernameField: 'id',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, id, password, done) => {
            try {
                //*** 로그인 및 암호화 등 비지니스 로직 작성 ***
                let sql = 'select * from tb_user where id = ?';
                let rslt = await db.queryTransaction(sql, [id]);

                if(rslt.result.length > 0){
                    let cipherPassword = await cipher.chkBcryptPassAsync(password, rslt.result[0].password);
                    if(cipherPassword){
                        if(rslt.result.length > 0){
                            //req.user 로 접근
                            let loginUser = rslt.result[0];
                            done(rslt.message, loginUser, {
                                message: `welcome ${id}`
                            });
                        }
                    }else{
                        done(rslt.message, false, {
                            message: 'invalid username or password'
                        });
                    }
                }else{
                    done(rslt.message, false, {
                        message: 'find not id'
                    });
                }
            } catch (error) {
                done(rslt.message, false, {
                    message: error
                });
            }

            
        }));
    return passport;
};