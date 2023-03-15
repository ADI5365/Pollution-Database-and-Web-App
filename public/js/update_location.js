/* 
    Citation for the following functions:
    Date retrieved: 2/23/2023
    Adapted from OSU NodeJS Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

let updatePersonForm = document.getElementById('update-location-form-ajax');

// Modifying a selected location in Locations
updatePersonForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCityName = document.getElementById("input-location_ID");
    let inputPopulation = document.getElementById("population-update");

    // Get the values from the form fields
    let cityNameValue = inputCityName.value;
    let populationValue = inputPopulation.value;

    // database table for People does not allow ID + age updating values to be NULL
    if (isNaN(populationValue))
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        city_name: cityNameValue,
        population: populationValue
    }

    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, cityNameValue);

            inputCityName.value = '';
            inputPopulation.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    console.log(data);

})

function updateRow(data, location_ID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("location-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == location_ID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td = updateRowIndex.getElementsByTagName("td")[3];
            // td.innerHTML = parsedData[0].name
       }
    }
}
