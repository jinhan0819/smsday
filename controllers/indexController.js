let config = require('../config');
let passport = require('../modules/passport')();
let sess = require('../modules/session');

module.exports = {
    index: function (req, res, next) {
        res.redirect('/user')
    },
    doLogin: function (req, res, next) {
        // let user = req.body;
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                console.log(user);
                // 로그인 실패시 다시 로그인 => return res.redirect(req.app.locals.__logToURL);
                return res.send({authenticate: false, user: user});
            }
            else {
                req.login(user, async (err) => {
                    sess.setPlain(req, 'auth', user.user_level);
                    sess.setPlain(req, 'userInfo', user);
                    
                    if (err) return next(err);
                    return res.send({authenticate: true, user: user});
                });
            }
        })(req, res, next);
    },
    doLogout: function (req, res) {
        sess.Clear(req, res);
        res.redirect('/');
    },
};
