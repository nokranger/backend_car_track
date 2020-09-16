const express = require('express')
const route = express.Router()
const connection = require('../models/connection')
const bodyParser = require('body-parser')
route.use(bodyParser.json())

route.post('/add', (req, res) => {
  console.log('code', req.body.cus_code)
  console.log('test')
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = "INSERT INTO customer (cus_code, cus_name, lat, lon, route_id, available, create_at, update_at, delete_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    var sql2 = 'SELECT * FROM customer'
    var value = [req.body.cus_code, req.body.cus_name, req.body.lat, req.body.lon, '', req.body.available, req.body.create_at, '', '']
    connection.query(sql, value, (err, result, fields) => {
      connection.query(sql2, (err, result, fields) => {
        console.log('query2')
        console.log(result)
        if (err) {
          res.status(404).json({
            err: err
          })
        }
        if (result.length > 0) {
          res.status(200).json({
            result: result
          })
        }
      })
      // console.log('bbbbbbb', typeof(result));
      console.log('insert done')
    });
    con.release()
  });
})

route.get('/get', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = 'SELECT * FROM customer'
      connection.query(sql, (err, result, fields) => {
        console.log('query2')
        console.log(result)
        if (err) {
          res.status(404).json({
            err: err
          })
        }
        if (result.length > 0) {
          res.status(200).json({
            result: result
          })
        }
      })
      // console.log('bbbbbbb', typeof(result));
      console.log('insert done')
    con.release()
  });
})

route.post('/getdetail', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = 'SELECT * FROM `customer` WHERE cus_code = ?'
    var value = [req.body.name]
      connection.query(sql, value, (err, result, fields) => {
        if (err) {
          res.status(404).json({
            err: err
          })
        }
        if (result.length > 0) {
          res.status(200).json({
            result: result
          })
        }
      })
      // console.log('bbbbbbb', typeof(result));
      console.log('get detail')
    con.release()
  });
})

route.patch('/updatedetail', (req, res) => {
  connection.getConnection((err, con) => {
    if (err) throw err;
    var sql = 'UPDATE customer SET route_id = ?, update_at = ? WHERE cus_code = ?'
    var sql2 = 'SELECT * FROM `customer` WHERE cus_code = ?'
    var value = [req.body.route_id, req.body.update_at, req.body.cus_code]
    var value2 = [req.body.cus_code]
    console.log(value)
      connection.query(sql, value, (err, result, fields) => {
        connection.query(sql2, value2, (err, result, fields) => {
          if (err) {
            res.status(404).json({
              err: err
            })
          }
          if (result.length > 0) {
            res.status(200).json({
              result: result
            })
          }
        })
      })
      // console.log('bbbbbbb', typeof(result));
      console.log('update detail')
    con.release()
  });
})

module.exports = route