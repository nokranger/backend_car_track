const express = require('express')
const route = express.Router()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
route.use(bodyParser.json())

route.post('/add', (req, res) => {
  console.log('code', req.body.code)
  console.log('test')
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = "INSERT INTO customer (cus_code, cus_name, lat, lon, route_id, available, create_at, update_at, delete_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    var sql2 = 'SELECT * FROM customer'
    var value = [req.body.cus_code, req.body.cus_name, req.body.lat, '', req.body.lon, req.body.available, req.body.create_at, '', '']
    connection.query(sql, value, (err, result, fields) => {
      // connection.query(sql2, (err, result, fields) => {
      //   console.log('query2')
      //   console.log(result)
      //   if (err) {
      //     res.status(404).json({
      //       err: err
      //     })
      //   }
      //   if (result.length > 0) {
      //     res.status(200).json({
      //       result: result
      //     })
      //   }
      // })
      // console.log('bbbbbbb', typeof(result));
      console.log('insert done')
    });
    
    con.release()
  });
})

route.post('/login', (req, res) => {
  console.log('id', req.body.test)
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