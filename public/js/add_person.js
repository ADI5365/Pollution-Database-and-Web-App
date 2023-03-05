addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("people-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let ageCell = document.createElement("TD");
    let locationCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.person_ID;
    ageCell.innerText = newRow.age;
    locationCell.innerTExt = newRow.location_ID

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.person_ID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(ageCell);
    row.appendChild(locationCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.person_ID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("input-person_ID");
    let option = document.createElement("option");
    option.text = newRow.person_ID;
    option.value = newRow.person_ID;
    selectMenu.add(option);
}
