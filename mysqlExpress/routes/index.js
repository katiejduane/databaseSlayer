var express = require('express');
var router = express.Router();
// Use the mysql module to connect and query from express/node
// the mysql module is not part of the core, so we need to npm install it
var mysql = require('mysql');
var config = require('../config')
var connection = mysql.createConnection(config);
connection.connect();

/* GET home page. */
// We want to load up a list of our restaurants on the homepage!
// These are inside of our mysql db!
// Inside this route, before we res.render a view, we want to query the database and
// get the data, then we can send it over to the views.
// .query takes two args, the query itself and a callback
router.get('/', function(req, res, next) {
    const query = 'SELECT * FROM restaurants;'
    connection.query(query, (err, results)=> {
        if(err){
            throw err;
        }else{
            res.json(results);
        }
    })
  
});

module.exports = router;
