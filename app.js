/*
    SETUP
*/
var express = require('express');
var app = express();
PORT = 3570;
var db = require('./database/db-connector');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

const { engine } = require('express-handlebars');
app.engine('.hbs', engine({extname: "hbs"}));
app.set('view engine', 'hbs');


/*
    ROUTES
*/
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/locations', (req, res) => {
    let query1 = 'SELECT * from Locations;';
    db.pool.query(query1, function(error, rows, fields) {
        res.render('locations', {data: rows});
    });
});

app.get('/people', (req, res) => {
    let query1 = 'SELECT * from People;';
    db.pool.query(query1, function(error, rows, fields) {
        res.render('people', {data: rows});
    });
});

app.post('/addLocation', (req, res) => {
    let data = req.body;

    query1 = `INSERT INTO Locations (city_name, state_name, total_population) VALUES ('${data.city_name}', '${data.state_name}', '${data.total_population}')`;
    db.pool.query(query1, function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            query2 = `SELECT * FROM Locations`;
            db.pool.query(query2, function(error, rows, fields) {
                if(error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('updateLocation', (req, res) => {
    let data = req.body;

    query1 = `SELECT city_name, state_name FROM Locations`;
    db.pool.query(query1, function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            query2 = `UPDATE Locations SET '${data.total_population}'`;
            db.pool.query(query2, function(error, rows, fields) {
                if(error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    query3 = `SELECT * FROM Locations`;
                    db.pool.query(query3, function(error, rows, fields) {
                        if(error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
            })
        }
    })
});


/*
    LISTENER
*/
app.listen(PORT, () => {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});