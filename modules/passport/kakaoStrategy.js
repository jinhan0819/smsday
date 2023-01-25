/* let passport = require('passport');
let KakaoStrategy = require('passport-kakao').Strategy;

module.exports = () => {

    passport.use('kakao', new KakaoStrategy({
        clientID: '401f6e8d8e16f4733eb6e3f8c376a6cb',
        callbackURL: '/auth/kakao/callback', // 설정한 Redirect URI
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
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

}; */