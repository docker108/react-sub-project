const express = require('express');
const app = express();

// cookier parser을 가져옴
const cookieParser = require('cookie-parser');

// 비밀 설정
const config = require('./config/key');

// package.json에서
//  /*nodemon을 이용해서 index.js를 실행하겠다. dev라고 써도 상관없다*/ 

// 회원가입을 하려면 유저의 정보를 가져와야 한다.
const { User } = require("./models/User");
const bodyParser = require("body-parser");

// auth가져오는 곳
const { auth } = require('./middleware/auth');
 
// application/x-www.form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해주는 것
app.use(bodyParser.urlencoded({extended: true}));
// application/json 타입으로 된 것을 분석해서 가져올 수 있게 해주는 것
app.use(bodyParser.json());
// cookie
app.use(cookieParser());


const mongoose = require('mongoose');
const { Router } = require('express');
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World~~!')
})

// client LandingPage에서 받아온 부분
app.get('/api/hello', (req, res) => res.send('안녕 ㅎ'))

// 회원가입
app.post('/api/users/register', (req, res) => {

    // 회원가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.

    const user = new User(req.body);

    // 정보들이 user모델에 저장됨
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {

  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user){
     return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인하기.
    
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

      // 비밀번호가 까지 맞다면 토큰을 생성하자.
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        // Token을 저장한다. 어디에? 쿠키, 로컬스토리지
        // 여러가지 방법이 있다 쿠키든 로컬스토리지든 세션이든
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id})  
      })
    })

   })

  // 비밀번호 까지 맞다면 토큰을 생성하기.
})


// auth부분

// role 1이 admin이고, role 2 특정부서 admin일때
// 지금은 role 0이 일반유저 나머지가 관리자 일때
app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 얘기는 authentication이 true라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    emial: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})
// 각각의 라우트가 다르다 user에 관련된것, product에 관련된 것 등...
// 나중에 route를 만들어 따로 정리함
// /api/users/user

// /api/product/create

// /api/users/comment

// 로그아웃 기능
app.get('/api/users/logout', auth, (req, res) => {

  User.findOneAndUpdate({_id: req.user._id},
    { token : ""},
    (err, user) => {
      if(err) return res.json({ success: false, err});
      return res.status(200).send({
        success: true
      })
    })
})

const port = 5000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})