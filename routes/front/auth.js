let express = require('express');
let passport = require('passport');
let customer = require('../../modules/passport/customer');
let sess = require('../../modules/session');
let config = require('../../config');

module.exports = function () {

    let router = express.Router();

//     /* 카카오 로그인 */
//     router.get('/kakao', passport.authenticate('kakao'));
//     router.get('/kakao/callback', 
//         function (req, res, next) {
//             passport.authenticate('kakao', function (err, user) {
//                 console.log('passport.authenticate(kakao)실행');
//                 if (!user) { return res.redirect('/login'); }
//                 req.logIn(user, async function (err) { 
//                     console.log('kakao/callback user : ', user);
//                     console.log(req.session.passport.user);

//                     let data = {
//                         id: user.profile.id,
//                         email: user.profile.kakao_account.email,
//                         provider: 'kakao'
//                     };
//                     let getUserAndPath = await customer.getUserAndPath(data);

//                     req.session.snsData = JSON.stringify(data);

//                     if(getUserAndPath.path == '/' && !(getUserAndPath.userInfo.constructor === Object && Object.keys(getUserAndPath.userInfo).length === 0)){
//                         sess.setPlain(req, 'userInfo', getUserAndPath.userInfo);
//                         sess.setPlain(req, 'authority', config.user);
//                     }

//                     return res.redirect(getUserAndPath.path);
//                 });
//             })(req, res);
//         }
//     );

//     /* 네이버 로그인 */
//     router.get('/naver', passport.authenticate('naver'));
//     router.get('/naver/callback', 
//         function (req, res, next) {
//             passport.authenticate('naver', function (err, user) {
//                 console.log('passport.authenticate(naver)실행');
//                 if (!user) { return res.redirect('/login'); }
//                 req.logIn(user, async function (err) { 
//                     console.log('naver/callback user : ', user);
//                     console.log(req.session.passport.user);

//                     let data = {
//                         id: user.profile.id,
//                         email: user.profile.email,
//                         provider: 'naver'
//                     };
//                     let getUserAndPath = await customer.getUserAndPath(data);

//                     req.session.snsData = JSON.stringify(data);

//                     if(getUserAndPath.path == '/' && !(getUserAndPath.userInfo.constructor === Object && Object.keys(getUserAndPath.userInfo).length === 0)){
//                         sess.setPlain(req, 'userInfo', getUserAndPath.userInfo);
//                         sess.setPlain(req, 'authority', config.user);
//                     }

//                     return res.redirect(getUserAndPath.path);
//                 });
//             })(req, res);
//         }
//     );

//     /* 구글 로그인 */
//     router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));
//     router.get('/google/callback', 
//         function (req, res, next) {
//             passport.authenticate('google', function (err, user) {
//                 console.log('passport.authenticate(google)실행');
//                 if (!user) { return res.redirect('/login'); }
//                 req.logIn(user, async function (err) { 
//                     console.log('google/callback user : ', user);
//                     console.log(req.session.passport.user);

//                     let data = {
//                         id: user.profile.sub,
//                         email: user.profile.email,
//                         provider: 'google'
//                     };
//                     let getUserAndPath = await customer.getUserAndPath(data);

//                     req.session.snsData = JSON.stringify(data);

//                     if(getUserAndPath.path == '/' && !(getUserAndPath.userInfo.constructor === Object && Object.keys(getUserAndPath.userInfo).length === 0)){
//                         sess.setPlain(req, 'userInfo', getUserAndPath.userInfo);
//                         sess.setPlain(req, 'authority', config.user);
//                     }

//                     return res.redirect(getUserAndPath.path);
//                 });
//             })(req, res);
//         }
//     );

    return router;

};