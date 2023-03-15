/* 
    Citation for the following function:
    Date retrieved: 2/23/2023
    Adapted from OSU NodeJS Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

addRowToTable = (data) => {

    let currentTable = document.getElementById("individual-health-issues-table");
    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and its cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let personCell = document.createElement("TD");
    let problemCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.person_health_ID;
    personCell.innerText = newRow.person_ID;
    problemCell.innerText = newRow.problem_ID;
 
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.person_health_ID);
    };

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(personCell);
    row.appendChild(problemCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.person_health_ID);

    // Add the row to the table
    console.log(row)
    currentTable.appendChild(row);

    let problemMenu = document.getElementById("health-problem-input");
    let problemOption = document.createElement("option");
    problemOption.text = newRow.problem_ID;
    problemOption.value = newRow.problem_ID;
    problemMenu.add(problemOption);

    let personMenu = document.getElementById("person-input");
    let personOption = document.createElement("option");
    personOption.text = newRow.person_ID;
    personOption.value = newRow.person_ID;
    personMenu.add(optpersonOptionion);
};