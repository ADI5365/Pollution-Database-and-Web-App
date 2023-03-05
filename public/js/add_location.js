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
    xhttp.open("POST", "/add-location-ajax", true);
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
    xhttp.send(JSON.stringify(data));

})

addRowToTable = (data) => {
    let currentTable = document.getElementById("location-table");
    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let populationCell = document.createElement("TD");
        
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    cityCell.innerText = newRow.city_name;
    stateCell.innerText = newRow.state_name;
    populationCell.innerText = newRow.total_population;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteLocation(newRow.location_ID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(populationCell);

    row.setAttribute('data-value', newRow.location_ID);
    
    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("input-location_ID");
    let option = document.createElement("option");
    option.text = newRow.city;
    option.value = newRow.location_ID;
    selectMenu.add(option);
}