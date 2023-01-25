/* let passport = require('passport');
let NaverStrategy = require('passport-naver').Strategy;

module.exports = () => {
    passport.use('naver', new NaverStrategy({
        clientID: 'zO5_tRLsXlBsoR6plGYe',
        clientSecret: 'UTDOQJWxe6',
        callbackURL: '/auth/naver/callback', // 설정한 Redirect URI
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile._json);
        console.log(accessToken);
        // console.log(refreshToken);

        try {
            let user_info = {
                profile: profile._json,
                accessToken: accessToken
            }
            
            done(null, user_info);
        } catch (error) {
            done(error);
        }
    }))
} */