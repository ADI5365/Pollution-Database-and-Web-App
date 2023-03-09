/*
    SETUP
*/
var express = require('express');
var app = express();
PORT = 3000;
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

// Display Health Problems table
app.get('/healthProblems', (req, res) => {
    let query1 = `SELECT * from Health_Problems;`;
    db.pool.query(query1, function(error, rows, fields) {
        return res.render('healthProblems', {data: rows});
    });
});

// Add new health problem
app.post('/addHealthProblem', (req, res) => {
    let data = req.body;

    query1 = `INSERT INTO Health_Problems (problem_name, problem_characteristics, is_terminal) VALUES ('${data['health-issue-input']}', '${data['characteristics-input']}', '${data['terminal-input']}')`;
    db.pool.query(query1, function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/healthProblems');
        }
    })
});


// CRUD OPERATIONS FOR INDIVIDUAL HEALTH ISSUES

// Display Individual Health Issues table
app.get('/individualHealthIssues', (req, res) => {
    let query1 = `SELECT * FROM Individual_Health_Issues;`;
    let query2 = `SELECT * FROM People;`;
    let query3 = `SELECT * FROM Health_Problems`;

    db.pool.query(query1, function(error, rows, fields) {
        let individual_problems = rows;
        db.pool.query(query2, function(error, rows, fields) {
            let people = rows;
            db.pool.query(query3, function(error, rows, fields) {
                let problems = rows;

                // //Display health problem name instead of ID
                // let problemmap = {}
                // problems.map(problem => {
                //     let problem_ID = parseInt(problem.problem_ID, 10);
                //     problemmap[problem_ID] = problem['problem_name'];
                // });
                // indivProb = indivProb.map(indiv => {
                //     return Object.assign(indiv, {problem_ID: problemmap[indiv.problem_ID]})
                // });
                
                return res.render('individualHealthIssues', {data: individual_problems, people: people, problems: problems});
            })
        })
    })
});

// Display health issues associated with a specific person
app.get('/browseIndividualHealthIssue', function(req, res)
{
    let query1 = `SELECT * FROM Individual_Health_Issues WHERE person_ID = "${req.query.indiv-input}%"`
    let query2 = `SELECT * FROM People`;
    let query3 = `SELECT * FROM Health_Problems`;

    db.pool.query(query1, function(error, rows, fields) {
        let individual_problems = rows;
        db.pool.query(query2, function(error, rows, fields) {
            let people = rows;
            db.pool.query(query3, function(error, rows, fields) {
                let problems = rows;
                return res.render('individualHealthIssues', {data: individual_problems, people: people, problems: problems});
            })
        })
    })
});

// Add new association between person and health problem
app.post('/addIndividualHealthIssue', (req, res) => {
    let data = req.body;

    query1 = `INSERT INTO Individual_Health_Issues (person_ID, problem_ID) VALUES ('${data['person-input']}', '${data['health-problem-input']}')`;
    db.pool.query(query1, function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/individualHealthIssues');
        }
    })
});

// CRUD OPERATIONS FOR CITY HEALTH ISSUES

// Display Health Issues by City table
app.get('/cityHealthIssues', (req, res) => {
    let query1 = `SELECT * FROM City_Health_Issues;`;
    let query2 = `SELECT * FROM Locations;`;
    let query3 = `SELECT * FROM Health_Problems`;

    db.pool.query(query1, function(error, rows, fields) {
        let city_problems = rows;
        db.pool.query(query2, function(error, rows, fields) {
            let locations = rows;
            db.pool.query(query3, function(error, rows, fields) {
                let problems = rows;

                //Display health problem name instead of ID
                
                return res.render('cityHealthIssues', {data: city_problems, locations: locations, problems: problems});
            })
        })
    })
});

// Add reported health issue to city's records
app.post('/addCityHealthIssue', (req, res) => {
    let data = req.body;

    query1 = `INSERT INTO City_Health_Issues (location_ID, problem_ID) VALUES ('${data['city-input']}', '${data['health-problem-input']}')`;
    db.pool.query(query1, function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/cityHealthIssues');
        }
    })
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

                // Display city name and date recorded instead of IDs
                let locationmap = {}
                locations.map(location => {
                    let location_ID = parseInt(location.location_ID, 10);
                    locationmap[location_ID] = location['city_name'];
                });
                daily_poll = daily_poll.map(dayLocPull => {
                    return Object.assign(dayLocPull, {location_ID: locationmap[dayLocPull.location_ID]});
                });

                let datemap = {}
                dates.map(date => {
                    let pollution_ID = parseInt(date.pollution_ID, 10);
                    datemap[pollution_ID] = date['date_recorded'];
                });
                daily_poll = daily_poll.map(dayLocPull => {
                    return Object.assign(dayLocPull, {pollution_ID: datemap[dayLocPull.pollution_ID]});
                });

                return res.render('dailyLocationPollution', {data: daily_poll, dates: dates, locations: locations});
            })
        })
    })
});

// Add new pollution readings for specific city on specific date
app.post('/addPollutionLevels', (req, res) => {
    let data = req.body;

    let particulate_level = parseInt(data.particulate_level);
    let NO2_level = parseInt(data.NO2_level);
    let PAH_level = parseInt(data.PAH_level);

    if (isNaN(particulate_level))
    {
        particulate_level = 'NULL'
    }
    if (isNaN(NO2_level))
    {
        NO2_level = 'NULL'
    }
    if (isNaN(PAH_level))
    {
        PAH_level = 'NULL'
    }

    query1 = `INSERT INTO Daily_Location_Pollution (location_ID, pollution_ID, particulate_level, NO2_level, PAH_level) VALUES ('${data['input-location_ID']}', '${data['input-date']}', '${particulate_level}', '${NO2_level}', '${PAH_level}')`;
    db.pool.query(query1, function(error, rows, fields) {
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/dailyLocationPollution')
        }
    })
});


/*
    LISTENER
*/
app.listen(PORT, () => {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
