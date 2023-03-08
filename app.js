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



// CRUD OPERATIONS FOR LOCATIONS

// Display table on Locations
app.get('/locations', (req, res) => {
    let query1 = `SELECT * from Locations;`;
    db.pool.query(query1, function(error, rows, fields) {
        let locations = rows;
        return res.render('locations', {data: locations, locations: locations});
    });
});

// Add new location
app.post('/addLocation', (req, res) => {
    let data = req.body;

    query1 = `INSERT INTO Locations (city_name, state_name, total_population) VALUES ('${data['input-city']}', '${data['input-state']}', '${data['input-population']}')`;
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
app.put('/put-location-ajax', (req, res) => {
    let data = req.body;
    let population = parseInt(data.total_population);
    let city = parseInt(data.city_name);
    let queryUpdatePopulation = `UPDATE Locations SET total_population = ? WHERE Locations.location_ID = ?`;

    db.pool.query(queryUpdatePopulation, [population, city], function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.send(rows);
        }
    })
});

// Delete a location
app.delete('/delete-location-ajax/', function(req,res,next){
    let data = req.body;
    let location_ID = parseInt(data.id);
    let deletePerson_Location = `DELETE FROM People WHERE location_ID = ?`;
    let deleteLocation = `DELETE FROM Locations WHERE location_ID = ?`;

    db.pool.query(deletePerson_Location, [location_ID], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(deleteLocation, [location_ID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});    



// CRUD OPERATIONS FOR PEOPLE

// Display table on People
app.get('/people', (req, res) => {
    let query1 = `SELECT * FROM People;`;
    let query2 = `SELECT * FROM Locations;`;

    db.pool.query(query1, function(error, rows, fields) {
        let people = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let locations = rows;
            
            
            // Displaying city name instead of ID in People table
            let locationmap = {}
            locations.map(location => {
                let location_ID = parseInt(location.location_ID, 10);
                locationmap[location_ID] = location['city_name'];
            });
            people = people.map(person => {
                return Object.assign(person, {location_ID: locationmap[person.location_ID]})
            })

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

// Update existing person age and location
app.put('/put-person-ajax', function(req, res, next){
    let data = req.body;
  
    let person_ID = parseInt(data.person_ID);
    let age = parseInt(data.age);
    let location_ID = parseInt(data.location_ID)
  
    let queryUpdatePeople = `UPDATE People SET age = ?, location_ID = ? WHERE People.person_ID = ? `;
    let selectCity = `SELECT * FROM Locations WHERE location_ID = ?`

    db.pool.query(queryUpdatePeople, [age, location_ID, person_ID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            db.pool.query(selectCity, [location_ID], function(error, rows, fields) {
  
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    let query1 = `SELECT * FROM People;`;
                    let query2 = `SELECT * FROM Locations;`;

                    db.pool.query(query1, function(error, rows, fields) {
                        let people = rows;
                        db.pool.query(query2, (error, rows, fields) => {
                            let locations = rows;
                            return res.render('people', {data: people, locations: locations})
                        })
                    });
                }
            })
        }
    })
});

// Delete a person
app.delete('/delete-person-ajax/', function(req,res,next){
    let data = req.body;
    let person_ID = parseInt(data.id);
    let deleteIndividual_Health_Issues_Person = `DELETE FROM Individual_Health_Issues WHERE person_health_ID = ?`;
    let deletePerson = `DELETE FROM People WHERE person_ID = ?`;

    db.pool.query(deleteIndividual_Health_Issues_Person, [person_ID], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
        else
        {
            db.pool.query(deletePerson, [person_ID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});



// CRUD OPERATIONS FOR HEALTH PROBLEMS

// Render health-problems page
app.get('/healthProblems', (req, res) => {
    res.render('healthProblems');
});



// CRUD OPERATIONS FOR INDIVIDUAL HEALTH ISSUES

// Render individual-health-issues page
app.get('/individualHealthIssues', (req, res) => {
    res.render('individualHealthIssues');
});



// CRUD OPERATIONS FOR CITY HEALTH ISSUES

// Render city-health-issues page
app.get('/cityHealthIssues', (req, res) => {
    res.render('cityHealthIssues');
});



// CRUD OPERATIONS FOR DATES WITH POLLUTION DATA

// Display table on Dates with Pollution Data
app.get('/pollutionLevelsByDay', (req, res) => {
    let query1 = `SELECT * from Pollution_Levels_By_Day;`;
    db.pool.query(query1, function(error, rows, fields) {
        let pollution_date = rows;
        return res.render('pollutionLevelsByDay', {data: pollution_date});
    });
});

// Add a new date to enter pollution data into
app.post('/addPollutionDate', (req, res) => {
    let data = req.body;

    query1 = `INSERT INTO Pollution_Levels_By_Day (date_recorded) VALUES ('${data['input-date']}')`;
    db.pool.query(query1, function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/pollutionLevelsByDay');
        }
    })
});

// Delete a date
app.delete('/delete-pollution-date-ajax/', function(req,res,next){
    let data = req.body;
    let pollution_ID = parseInt(data.id);
    let deleteDaily_Location_Pollution_Days = `DELETE FROM Daily_Location_Pollution WHERE pollution_ID = ?`;
    let deletePollutionDate = `DELETE FROM Pollution_Levels_By_Day WHERE pollution_ID = ?`;

    db.pool.query(deleteDaily_Location_Pollution_Days, [pollution_ID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(deletePollutionDate, [pollution_ID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});



// CRUD OPERATIONS FOR DAILY POLLUTION BY LOCATION

// Display Daily Location Pollution page
app.get('/dailyLocationPollution', (req, res) => {
    let query1 = `SELECT * FROM Daily_Location_Pollution`;
    let query2 = `SELECT * FROM Pollution_Levels_By_Day`;
    let query3 = `SELECT * FROM Locations`;

    db.pool.query(query1, function(error, rows, fields) {
        let daily_poll = rows;
        db.pool.query(query2, function(error, rows, fields) {
            let dates = rows;
            db.pool.query(query3, function(error, rows, fields) {
                let locations = rows;
                return res.render('dailyLocationPollution', {data: daily_poll, dates: dates, locations: locations});
            })
        })
    })
});


/*
    LISTENER
*/
app.listen(PORT, () => {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
