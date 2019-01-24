var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var config = require('../config')
var connection = mysql.createConnection(config);
connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  const selectQuery = 'SELECT * FROM tasks;';
  connection.query(selectQuery,(error, results)=>{
    res.render('index', {taskArray: results})
  })
});

router.post('/addItem',(req, res, next) => {
  const newTask = req.body.newTask;
  const newTaskDate = req.body.newTaskDate;
  // We know what the user submitted in the form. It comes to this route
  // inside req.body.nameoffield. !e store those values into a var.
  // Now we take those varsand insertthem into MySql

  // // THIS IS BAD!!!!!! (ie opens up DB to SQL injection, so unsafe)
  // const insertQuery = `INSERT INTO tasks (taskName, taskDate)
  //   VALUES
  //   (${newTask}, ${newTaskDate});`
  const insertQuery = `INSERT INTO tasks(taskName, taskDate)
    VALUES
    (?, ?);`
  connection.query(insertQuery, [newTask, newTaskDate], (err, results)=>{
    if(err){
      throw err;
    }else{
      console.log(insertQuery)
      res.redirect('/')
    }
  })
  // res.json(req.body)
})

module.exports = router;
