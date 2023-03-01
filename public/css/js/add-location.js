// Get the objects we need to modify
let addLocationForm = document.getElementById('addLocation');

// Modify the objects we need
addLocationForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCity = document.getElementById("input-city");
    let inputState = document.getElementById("input-state");
    let inputPopulation = document.getElementById("input-population");

    // Get the values from the form fields
    let cityNameValue = inputCity.value;
    let stateNameValue = inputState.value;
    let populationValue = inputPopulation.value;

    // Put our data we want to send in a javascript object
    let data = {
        city_name: cityNameValue,
        state_name: stateNameValue,
        total_population: populationValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/addLocation", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCity.value = '';
            inputState.value = '';
            inputPopulation.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("location-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let cityNameCell = document.createElement("TD");
    let stateNameCell = document.createElement("TD");
    let populationCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    cityNameCell.innerText = newRow.city_name;
    stateNameCell.innerText = newRow.state_name;
    populationCell.innerText = newRow.population;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(cityNameCell);
    row.appendChild(stateNameCell);
    row.appendChild(populationCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}