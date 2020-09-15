const express = require('express')
const route = express.Router()
// const app = express()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const ExtractJwt = require('passport-jwt').ExtractJwt
const JwtStrategy = require('passport-jwt').Strategy
const passport = require('passport')
route.use(bodyParser.json())

const SECRET = 'MY_SECRET_KEY'

const jwtOption = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: SECRET
}


const JwtAuth = new JwtStrategy(jwtOption, (payload, done) => {
  if(payload.sub == req.body.user_id) done(null, true)
  else done(null, false)
})
passport.use(JwtAuth)

const requireJWTAuth = passport.authenticate('jwt', {session: false})



//getallemp
// route.get('/aa', requireJWTAuth, (req,res) => {
//   res.send('aa')
// })
route.post('/login', (req, res) => {
  console.log('id', req.body.user_id)
  console.log('password', req.body.password)
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = 'SELECT user_id, password FROM member WHERE user_id = ? AND password = ?'
    var value = [req.body.user_id, req.body.password]
    connection.query(sql, value, (err, result, fields) => {
      if (err) throw err;
      // console.log(result);
      if (result.length > 0) {
        // console.log(result[0].user_id)
        // console.log(result[0].permission)
        const token = jwt.sign(
          {
          sub: result[0].user_id,
          iat: new Date().getTime(), // issue at time,
          role: 1,
          loginSuccessfull: true,
          },process.env.JWT_KEY,
          {
            expiresIn: '10m'
          })
        console.log('success')
          // res.status(200).json(jwt.encode(payload, SECRET))
        res.status(200).json(token)
      } else {
        console.log('unsuccess')
        res.status(404).json({
          message: 'NOT FOUND'
        })
      }
      con.release()
    });
  });
  console.log('done selected')
})


module.exports = route