addRowToTable = (data) => {
    let currentTable = document.getElementById("health-problems-table");
    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let probNameCell = document.createElement("TD");
    let characteristicsCell = document.createElement("TD");
    let terminalCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.problem_id;
    probNameCell.innerText = newRow.problem_name;
    characteristicsCell.innerText = newRow.problem_characteristics;
    terminalCell.innerText = newRow.is_terminal;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(probNameCell);
    row.appendChild(characteristicsCell);
    row.appendChild(terminalCell);

    row.setAttribute('data-value', newRow.problem_ID);
    
    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("input-location_ID");
    let option = document.createElement("option");
    option.text = newRow.city;
    option.value = newRow.location_ID;
    selectMenu.add(option);
}