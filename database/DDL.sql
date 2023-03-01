-- Group Number: 94
-- Group Members: Andrea Irwin and Sangtawun Miller

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- Creates an entity table named Locations
CREATE TABLE Locations (
    location_ID int NOT NULL AUTO_INCREMENT,
    city_name varchar(255) NOT NULL,
    state_name varchar(255) NOT NULL,
    total_population int NOT NULL,
    UNIQUE (location_ID),
    PRIMARY KEY (location_ID)
);

-- Creates an entity table named People
CREATE TABLE People (
    person_ID int NOT NULL AUTO_INCREMENT,
    age int NOT NULL,
    location_ID int,
    UNIQUE (person_ID),
    PRIMARY KEY (person_ID),
    FOREIGN KEY (location_ID) REFERENCES Locations(location_ID)
    ON DELETE CASCADE
);

-- Creates an intersection table named Individual_Health_Issues
CREATE TABLE Individual_Health_Issues (
    person_health_ID int NOT NULL AUTO_INCREMENT,
    person_ID int,
    problem_ID int,
    PRIMARY KEY (person_health_ID),
    FOREIGN KEY (person_ID) REFERENCES People(person_ID),
    FOREIGN KEY (problem_ID) REFERENCES Health_Problems(problem_ID)
    ON DELETE CASCADE
);

-- Creates an entity table named Health_Problems
CREATE TABLE Health_Problems (
    problem_ID int NOT NULL AUTO_INCREMENT,
    problem_name VARCHAR(255) NOT NULL,
    problem_characteristics VARCHAR(255),
    is_terminal boolean,
    UNIQUE (problem_ID),
    PRIMARY KEY (problem_ID)
);

-- Creates an intersection table named City_Health_Issues
CREATE TABLE City_Health_Issues (
    city_health_ID int NOT NULL AUTO_INCREMENT,
    location_ID int,
    problem_ID int,
    PRIMARY KEY (city_health_ID),
    FOREIGN KEY (location_ID) REFERENCES Locations(location_ID),
    FOREIGN KEY (problem_ID) REFERENCES Health_Problems(problem_ID)
    ON DELETE CASCADE
);

-- Creates an entity table named Pollution_Levels_By_Day
CREATE TABLE Pollution_Levels_By_Day (
    pollution_ID int NOT NULL AUTO_INCREMENT,
    date_recorded DATE NOT NULL,
    UNIQUE (pollution_ID),
    PRIMARY KEY (pollution_ID)
);

-- Creates an intersection table named Daily_Location_Pollution
CREATE TABLE Daily_Location_Pollution (
    log_date int NOT NULL AUTO_INCREMENT,
    location_ID int,
    pollution_ID int,
    particulate_level decimal,
    NO2_level decimal,
    PAH_level decimal,
    PRIMARY KEY (log_date),
    FOREIGN KEY (location_ID) REFERENCES Locations(location_ID),
    FOREIGN KEY (pollution_ID) REFERENCES Pollution_Levels_By_Day(pollution_ID)
	ON DELETE CASCADE
);

-- Inserts 5 records into the Locations table
-- Information taken from https://www.macrotrends.net/cities/largest-cities-by-population
INSERT INTO Locations (city_name, state_name, total_population)
VALUES ('New York City', 'New York', 18937000),
('Los Angeles', 'California', 12534000),
('Chicago', 'Illinois', 8937000),
('Houston', 'Texas', 6707000),
('Dallas-Fort Worth', 'Texas', 6574000);

-- Inserts 5 records into the People table
INSERT INTO People (location_ID, age)
VALUES ((SELECT location_ID from Locations where city_name = 'New York City'), 55),
((SELECT location_ID from Locations where city_name = 'Los Angeles'), 44),
((SELECT location_ID from Locations where city_name = 'Chicago'), 61),
((SELECT location_ID from Locations where city_name = 'Houston'), 29),
((SELECT location_ID from Locations where city_name = 'Dallas-Fort Worth'), 53);

-- Inserts 5 records into the Health_Problems table
-- Information taken from https://www.who.int/teams/environment-climate-change-and-health/air-quality-and-health/health-impacts#:~:text=The%20specific%20disease%20outcomes%20most,(household%20air%20pollution%20only).
INSERT INTO Health_Problems (problem_name, problem_characteristics, is_terminal)
VALUES ('chronic obstructive pulmonary disease', 'shortness of breath, wheezing, chronic cough', NULL),
('stroke', 'paralysis with weak muscles, vertigo, slurred speech, mental confusion', NULL),
('ischaemic heart disease', 'chest pain', NULL),
('lung cancer', 'chronic cough, chest pressure, fatigue, chest pain, wheezing', 1),
('pneumonia', 'fever, malaise, coughing, sharp chest pain, wheezing', NULL);

-- Inserts 5 records into the Individual_Health_Issues Table
INSERT INTO Individual_Health_Issues (person_ID, problem_ID)
VALUES ((SELECT person_ID from People where person_ID = 1), (SELECT problem_ID from Health_Problems where problem_ID = 2)),
((SELECT person_ID from People where person_ID = 2), (SELECT problem_ID from Health_Problems where problem_ID = 5)),
((SELECT person_ID from People where person_ID = 3), (SELECT problem_ID from Health_Problems where problem_ID = 5)),
((SELECT person_ID from People where person_ID = 4), (SELECT problem_ID from Health_Problems where problem_ID = 1)),
((SELECT person_ID from People where person_ID = 5), (SELECT problem_ID from Health_Problems where problem_ID = 5));

-- Inserts 5 records into City_Health_Issues
INSERT INTO City_Health_Issues (location_ID, problem_ID)
VALUES ((SELECT location_ID from People where person_ID = 1), (SELECT problem_ID from Health_Problems where problem_ID = 2)),
((SELECT location_ID from People where person_ID = 2), (SELECT problem_ID from Health_Problems where problem_ID = 5)),
((SELECT location_ID from People where person_ID = 3), (SELECT problem_ID from Health_Problems where problem_ID = 5)),
((SELECT location_ID from People where person_ID = 4), (SELECT problem_ID from Health_Problems where problem_ID = 1)),
((SELECT location_ID from People where person_ID = 5), (SELECT problem_ID from Health_Problems where problem_ID = 5));

-- Inserts 5 records into Pollution_Levels_By_Day
INSERT INTO Pollution_Levels_By_Day (date_recorded)
VALUES ('2023-02-01'),
('2023-02-02'),
('2023-02-03'),
('2023-02-04'),
('2023-02-05');

-- Inserts 5 records into Daily_Location_Pollution
-- Particulate information taken from https://www.iqair.com/us/usa/
INSERT INTO Daily_Location_Pollution (location_ID, pollution_ID, particulate_level, NO2_level, PAH_level)
VALUES ((SELECT location_ID from Locations where city_name = 'New York City'), (SELECT pollution_ID from Pollution_Levels_By_Day where date_recorded = '2023-02-1'), 12, 1, 0.2),
((SELECT location_ID from Locations where city_name = 'New York City'), (SELECT pollution_ID from Pollution_Levels_By_Day where date_recorded = '2023-02-02'), 13, 1, 0.1),
((SELECT location_ID from Locations where city_name = 'Chicago'), (SELECT pollution_ID from Pollution_Levels_By_Day where date_recorded = '2023-02-01'), 15, 2, 0.1),
((SELECT location_ID from Locations where city_name = 'Los Angeles'), (SELECT pollution_ID from Pollution_Levels_By_Day where date_recorded = '2023-02-01'), 5, 1, 0.1),
((SELECT location_ID from Locations where city_name = 'Los Angeles'), (SELECT pollution_ID from Pollution_Levels_By_Day where date_recorded = '2023-02-02'), 8, 1, 0.1);

-- Display all tables
SELECT * from Locations;
SELECT * from People;
SELECT * from Health_Problems;
SELECT * from Individual_Health_Issues;
SELECT * from City_Health_Issues;
SELECT * from Pollution_Levels_By_Day;
SELECT * from Daily_Location_Pollution;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;