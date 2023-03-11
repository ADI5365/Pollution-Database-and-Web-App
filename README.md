# Pollution and Health Across the United States

### Code adapted from cs340 nodejs-starter-app: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

## Overview

The Pollution and Health database is built to be used by public health officials to discern 
a correlation between reported health problems and average pollution levels for the 20 most 
populous cities in the United States. Previously there have been local lists holding the 
information about statistics of health problems and pollutants separately and only per city. 
This will be a database-driven website that will record health problems for the populations 
in different cities across the US in correlation to the pollutants found in each metro. 

The database will have the capability to record People with Health_Problems in each Location. 
There are 3 tracked pollutant levels - particulate matter (healthy range: below 12 μg/m3, 
unhealthy range: above 35 μg/m3), nitrogen dioxide (NO2; healthy range: below 1 part per million 
(PPM), unhealthy range: above 3 PPM), and polycyclic aromatic hydrocarbons (PAHs; healthy range: 
below 0.2 mg/m3, unhealthy range: above 0.3 mg/m3). They are measured once a day in each city at 
12pm local time and entered into a new entry in the Pollution_Levels_By_Day table. 

This database will provide the observations of different pollutants and their potential health 
effects on metropolitan populations in an easily accessible electronic record for public health 
officials to access when working on new public health initiatives. For the sake of simplicity, 
we are assuming individuals are remaining in one metro area and not moving around, and we will 
only include information from people who report a health issue.

## Database Outline

Entity 1: Locations – records the details of the metro Locations being studied in the US
  - location_ID: INT, auto_increment, unique, not NULL, PK
  - city_name: VARCHAR(255), not NULL
  - state_name: VARCHAR(255), not NULL
  - total_population: INT, not NULL
  - Relationships:
    - 1:M relationship between Locations and People is implemented with location_ID as an FK inside 
    of People. For each location there are 1 or many people, and for each person there is one location.
    - M:N relationship between Locations and Pollution_Levels_By_Day is implemented with an intersection 
    table that has two foreign keys (location_ID and pollution_ID). Each location must be associated with 
    1 or many pollutants, and each pollutant must be associated with 1 or many locations.
    - M:N relationship between Locations and Health_Problems is implemented with an intersection table 
    that has two foreign keys (location_ID and problem_ID). Each location may be associated with 0, 1, 
    or many health issues, and a health issue must be associated with a location.

Entity 2: People – records the details of People living within a metro area
  - person_ID: INT, auto_increment, unique, not NULL, PK
  - location_ID: INT, FK from Locations
  - age: INT, not NULL
  - Relationships:
    - M:1 relationship between People and Locations is implemented with location_ID as an FK inside of 
    People. A person must be associated with a location.
    - M:N relationship between People and Health_Problems is implemented with an intersection table 
    that has two foreign keys (person_ID and problem_ID). Each health problem must be associated with a 
    person and each person must be associated with 1 or many health problems.

Entity 3: Health_Problems – records the details of reported Health_Problems
  - problem_ID: INT, auto_increment, unique, not NULL, PK
  - problem_name: VARCHAR(255), not NULL
  - problem_characteristics: VARCHAR(255), can be NULL
  - is_terminal: boolean, can be NULL
  - Relationships:
    - M:N relationship between Health_Problems and People is implemented with an intersection table 
    that has two foreign keys (problem_ID and person_ID). Each health problem must be associated with 
    a person and each person must be associated with a health problem.
    - M:N relationship between Locations and Health_Problems is implemented with an intersection table 
    that has two foreign keys (location_ID and problem_ID). Each location may be associated with zero 
    or many health issues, but a health issue must be associated with a location.

Entity 4: Pollution_Levels_By_Day – records the details of different pollution levels found in metro areas on each calendar day
  - pollution_ID: INT, auto_increment, unique, not NULL, PK
  - date_recorded: DATE, not NULL
  - Relationships:
    - M:N relationship between Pollution_Levels_By_Day and Locations is implemented with an intersection 
    table that has two foreign keys (pollution_ID and location_ID). Each Pollution_Levels_By_Day must be 
    associated with many locations and each location must be associated with many recorded pollution levels, 
    as each location’s pollution levels are logged every day.

Intersection Table 1: Daily_Location_Pollution - intersection table between Locations and Pollution_Levels_By_Day
  - daily_log_ID: INT, auto-increment, unique, not NULL, PK
  - location_ID: INT, FK from Locations
  - pollution_ID: INT, FK from Pollution_Levels_By_Day
  - particulate_level: DECIMAL, can be NULL
  - NO2_level: DECIMAL, can be NULL
  - PAH_level: DECIMAL, can be NULL
  - Relationships:
    - 1:M relationship with Locations and 1:M relationship with Pollution_Levels_By_Day, so that there is 1 log 
    entry for each city’s pollution levels for each day

Intersection Table 2: City_Health_Issues - intersection table between Locations and Health_Problems
  - city_health_ID: INT, auto-increment, unique, not NULL, PK
  - problem_ID: INT, FK from Health_Problems
  - location_ID: INT, FK from Locations
  - Relationships:
    - 1:M relationship with Locations and 1:M relationship with Health_Problems, so that there is 1 entry for 
    each health problem that is in each city

Intersection Table 3: Individual_Health_Issues - intersection table between People and Health_Problems
  - person_health_ID: INT, auto-increment, unique, not NULL, PK
  - problem_ID: INT, FK from Health_Problems
  - person_ID: INT, FK from People
  - Relationships:
    - 1:M relationship with People and 1:M relationship with Health_Problems, so that there is 1 entry 
    for each health issue held by each person
    
## Entity-Relationship Diagram
![Project Step 3 ERD](https://user-images.githubusercontent.com/85050071/222992378-a3211375-0bda-48c6-920d-397288f8f47a.png)

## Schema
![Project Step 3 Schema](https://user-images.githubusercontent.com/85050071/222992399-6ed26ec3-8815-4561-b074-1a6c3de9deb8.png)
