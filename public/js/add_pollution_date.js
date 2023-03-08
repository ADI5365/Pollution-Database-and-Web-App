addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("pollution-date-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.pollution_ID;
    dateCell.innerText = newRow.date_recorded;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePollutionDate(newRow.pollution_ID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(dateCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.pollution_ID);

    // Add the row to the table
    currentTable.appendChild(row);
}