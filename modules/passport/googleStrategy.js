/* let passport = require('passport');
let GoogleStrategy = require('passport-google-oauth2').Strategy;

module.exports = () => {
    passport.use('google', new GoogleStrategy({
        clientID: '381711051858-r65suludd0i3hv5fhiajen6nfac60rlg.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: '/auth/google/callback', // 설정한 Redirect URI
        passReqToCallback: true,
    }, async (req, accessToken, refreshToken, profile, done) => {
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
} */