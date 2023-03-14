/* 
    Citation for the following function:
    Date retrieved: 2/23/2023
    Adapted from OSU NodeJS Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

addRowToTable = (data) => {

    let currentTable = document.getElementById("location-pollution-table");
    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and its cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let locationCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let particulateCell = document.createElement("TD");
    let NO2Cell = document.createElement("TD");
    let PAHCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.log_date;
    locationCell.innerText = newRow.location_ID;
    dateCell.innerText = newRow.pollution_ID;
    particulateCell.innerText = newRow.particulate_level;
    NO2Cell.innerText = newRow.NO2_level;
    PAHCell.innerText = newRow.PAH_level;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteDailyLocPoll(newRow.log_date);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(locationCell);
    row.appendChild(dateCell);
    row.appendChild(particulateCell);
    row.appendChild(NO2Cell);
    row.appendChild(PAHCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.log_date);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option, then append option to
    // drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let dateMenu = document.getElementById("input-date");
    let dateOption = document.createElement("option");
    dateOption.text = newRow.log_date;
    dateOption.value = newRow.log_date;
    dateMenu.add(dateOption);

    let cityMenu = document.getElementById("input-location_ID");
    let cityOption = document.createElement("option");
    cityOption.text = newRow.log_date;
    cityOption.value = newRow.log_date;
    cityMenu.add(cityOption);
}
