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

// Display table on Locations
app.get('/locations', (req, res) => {
    let query1 = 'SELECT * from Locations;';
    db.pool.query(query1, function(error, rows, fields) {
        res.render('locations', {data: rows});
    });
});

// Add new location
app.post('/addLocation', (req, res) => {
    let data = req.body;

    query1 = `INSERT INTO Locations (city_name, state_name, total_population) VALUES ('${data['input-city_name']}', '${data['input-state_name']}', '${data['input-total_population']}')`;
    db.pool.query(query1, function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/locations')
        }
    })
});

// Update existing location population
app.post('updateLocation', (req, res) => {
    let data = req.body;

    query1 = `SELECT city_name, state_name FROM Locations`;
    db.pool.query(query1, function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            query2 = `UPDATE Locations SET '${data['input-total_population']}'`;
            db.pool.query(query2, function(error, rows, fields) {
                if(error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.redirect('/locations')
                }
            })
        }
    })
});

// Display table on People
app.get('/people', (req, res) => {
    let query1 = 'SELECT * from People;';
    db.pool.query(query1, function(error, rows, fields) {
        res.render('people', {data: rows});
    });
});

// Add new person
app.post('/addPerson', (req, res) => {
    let data = req.body;

    query1 = `INSERT INTO People (age, location_ID) VALUES ('${data['input-age']}', '${data['input-location_ID']}')`;
    db.pool.query(query1, function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/people')
        }
    })
});

// Update existing person age
app.post('updatePerson', (req, res) => {
    let data = req.body;

    query1 = `SELECT person_ID FROM People`;
    db.pool.query(query1, function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            query2 = `UPDATE People SET '${data['input-age']}'`;
            db.pool.query(query2, function(error, rows, fields) {
                if(error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.redirect('/people')
                }
            })
        }
    })
});

// Delete a person
app.post('/deletePerson', (req, res) => {
    let data = req.body;

    query1 = `DELETE FROM People WHERE person_ID = ${data['input-person_ID']}`;
    db.pool.query(query1, function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/people')
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, () => {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});