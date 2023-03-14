/* 
    Citation for the following function:
    Date retrieved: 2/23/2023
    Adapted from OSU NodeJS Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

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
        deleteLocation(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(populationCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("input-location_ID");
    let option = document.createElement("option");
    option.text = newRow.city_name;
    option.value = newRow.city_name;
    selectMenu.add(option);
}