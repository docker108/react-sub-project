const { User } = require("../models/User");



let auth = (req, res, next) => {

    // 인증 처리를 하는 곳

    // 클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;


    // 토큰을 복호화 한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        // 유저가 없으면 인증 실패
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        // 유저가 있으면 인증 성공
        req.token = token;
        req.user = user;
        next(); // next를 안 하면 middleware에 갇힌다. 
    })


}


// 다른 file에서도 쓸수 있게끔
module.exports = { auth };