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
}