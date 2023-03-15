/* 
    Citation for the following function:
    Date retrieved: 2/23/2023
    Adapted from OSU NodeJS Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

addRowToTable = (data) => {
    let currentTable = document.getElementById("health-problems-table");
    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and its cells
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

    let selectMenu = document.getElementById("health-problem-input");
    let option = document.createElement("option");
    option.text = newRow.problem_name;
    option.value = newRow.problem_id;
    selectMenu.add(option);
}