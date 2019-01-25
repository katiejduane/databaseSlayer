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

// a wildcard route in express has a : in front of it
// wildcard routes are available in req.params
router.get('/delete/:id', (req, res, next) => {
  // res.json(req.params)
  const deleteQuery = `DELETE FROM tasks WHERE id = ?;`;
  connection.query(deleteQuery, [req.params.id], (error) => {
    res.redirect('/');
  })
})

router.get('/update/:id', (req, res, next) => {
  // this route should be a pre-populated form with the element with this id values
  const selectUpdate = `SELECT * FROM tasks WHERE id = ?;`;
  connection.query(selectUpdate, [req.params.id], (error, results)=>{
    let formattedDate = formatDate(results[0].taskDate);
    results[0].taskDate = formattedDate;
    res.render('update', {task: results[0]})
  })
})

router.post('/updateItem', (req, res, next)=> {
  const updateQuery = `UPDATE tasks SET
    taskName = ?,
    taskDate = ?
    WHERE id = ?`
  connection.query(updateQuery, [req.body.newTask, req.body.newTaskDate, req.body.taskId], (error, results) => {
    if (error){
      throw error;
    } else {res.redirect('/');}
  })
});


module.exports = router;

function formatDate(date) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}