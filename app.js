/*
    SETUP
*/
var express = require('express');
var app = express();
PORT = 62110;
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

// Render homepage
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
    let query1 = 'SELECT * FROM People;';
    let query2 = 'SELECT * FROM Locations;';

    db.pool.query(query1, function(error, rows, fields) {
        let people = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let locations = rows;
            return res.render('people', {data: people, locations: locations})
        })
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
app.post('/updatePerson', (req, res) => {
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
app.delete('/delete-person-ajax/', function(req,res,next){
    let data = req.body;
    let person_ID = parseInt(data.id);
    let deleteIndividual_Health_Issues_Person = `DELETE FROM Individual_Health_Issues WHERE person_ID = ?`;
    let deletePerson = `DELETE FROM People WHERE person_ID = ?`;

        db.pool.query(deletePerson, [person_ID], function(error, rows, fields){
            if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            else
            {
                db.pool.query(deleteIndividual_Health_Issues_Person, [person_ID], function(error, rows, fields) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
})});

// Render health-problems page
app.get('/health-problems', (req, res) => {
    res.render('health-problems');
});

// Render individual-health-issues page
app.get('/individual-health-issues', (req, res) => {
    res.render('individual-health-issues');
});

// Render city-health-issues page
app.get('/city-health-issues', (req, res) => {
    res.render('city-health-issues');
});

// Render pollution-by-day page
app.get('/pollution-by-day', (req, res) => {
    res.render('pollution-by-day');
});

// Render daily-location-pollution page
app.get('/daily-location-pollution', (req, res) => {
    res.render('daily-location-pollution');
});

/*
    LISTENER
*/
app.listen(PORT, () => {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
