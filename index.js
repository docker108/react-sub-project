const express = require('express')
const app = express()
const port = 5000

// 비밀 설정
const config = require('./config/key');
require('dotenv').config({ path: 'ENV_FILENAME' });

// package.json에서
//  /*nodemon을 이용해서 index.js를 실행하겠다. dev라고 써도 상관없다*/ 

// 회원가입을 하려면 유저의 정보를 가져와야 한다.
const { User } = require("./models/User")
const bodyParser = require("body-parser")
 
// application/x-www.form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해주는 것
app.use(bodyParser.urlencoded({extended: true}));
// application/json 타입으로 된 것을 분석해서 가져올 수 있게 해주는 것
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World~~!')
})

// 회원가입
app.post('/register', (req, res) => {

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})