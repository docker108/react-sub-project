// model
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength:50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    }, 
    tokenExp: {
        type: Number
    }    
    
})

userSchema.pre('save', function(next){
    var user = this;

    // 비밀번호를 수정했을 때만 비밀번호를 암호화시키는 조건
    // 다른 이름이나 이메일등을 수정했을 때 비밀번호를 한번 더 암호화 시키지 않기 위해서
    if(user.isModified('password')){
    // 비밀번호 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function(err, salt){
        
        if(err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err)
            user.password = hash
            next()
        })
    })
} else { // 비밀번호 수정이 아닐 때는 그냥 빠져나오게끔
    next()
}
})
    // 위에랑 같은 코드 아래 코드는 홈페이지에 나와있음
    // bcrypt.genSalt(saltRounds, function(err, salt) {
    //     bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
    //         // Store hash in your password DB.
    //     });
    // });

    userSchema.methods.comparePassword = function(plainPassword, cb){

        // plainPassword 1234567 암호화된 비밀번호 $2b$10$PWTcgRmhmhz/8wMUygrVNuuzKAnwS7FG2aciC3E31efSB8wwfIyIW
        // 이 두개가 같은지 체크하기 암호화된걸 복호화 하지않는다. 
        bcrypt.compare(plainPassword, this.password, function(err, isMatch){
            if(err) return cb(err); // ,말고 ;
            cb(null, isMatch); // 이게 true
        })
    }
    // cb는 callback
    userSchema.methods.generateToken = function(cb){
        var user = this;
        // jsonwebtoken을 이용해서 token을 생성하기
        
        var token = jwt.sign(user._id.toHexString(), 'secretToken')

        // user._id + 'secretToken' = token
        // -> 
        // 'secretToken' -> user._id

        user.token = token
        user.save(function(err, user){
            if(err) return cb(err)
            cb(null, user)
        })
    }

    userSchema.statics.findByToken = function(token, cb){
        var user = this;

        // user._id + '' = token;
        // 토큰을 decode한다.
        jwt.verify(token, 'secretToken', function(err, decoded){
            // 유저 아이디를 이용해서 유저를 찾은 다음에 
            // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

            user.findOne({"_id": decoded, "token": token}, function(err, user){

                if(err) return cb(err);
                cb(null, user)

            })
        })

    }
    

const User = mongoose.model('User', userSchema)

module.exports = { User } // module를 다른 곳에서도 사용할 수 있게!