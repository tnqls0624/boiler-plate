const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const {User} = require('./server/models/User');
const {auth} = require('./server/middleware/auth');
const cookieParser = require('cookie-parser');
const config = require('./server/config/key');
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());
//몽고디비 연결
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then( ()=> console.log('mongoDB Connected...')).catch(err => console.log(err));


app.get('/', (req, res) => {
  res.send('Hello World!~~ 안녕하세요!!!');
});
app.get('/api/hello', (req,res) =>{
  res.send('안녕하세여');
});

app.post('/api/users/register', (req, res) => {
  // 회원가입할때 필요한 정보들을  client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success : false , err});
    return res.status(200).json({
      success: true
    });
  });
});

app.post('/api/users/login', (req,res) => {
  User.findOne({email : req.body.email}, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess : false,
        message : 'このメールアドレスではIDが登録されていません。'
      })
    }
    console.log('req.body.password:'+req.body.password);
    user.comparePassword(req.body.password, (err, isMatch) => {
      console.log('isMatch2:'+isMatch);
      if(!isMatch)
        return res.json({loginSuccess:false, message:'パスワードが正しくありません。'})
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err)
          res.cookie('x_auth', user.token)
          .status(200)
          .json({loginSuccess:true, userId: user._id})
      })
    })
  })
})

app.get('/api/users/auth', auth , (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Auth가 True라는 말
  res.status(200).json({
    _id : req.userId,
    isAdmin: req.user.role === 0 ? false:true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  });
});

app.get('/api/users/logout', auth , (req , res) => {

  User.findOneAndUpdate({_id: req.user._id},
    {token : ""},
    (err, user) => {
      if(err) return res.json({success: false , err});
      return res.status(200).send({success: true});
    });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})