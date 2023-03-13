let updateHealthProbelmForm = document.getElementById('update-health-problem-form-ajax');

// Modify the objects we need
updateHealthProbelmForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("health-problem-input");
    //let inputName = document.getElementById("health-problem-input");
    let inputCharacteristics = document.getElementById("characteristics-input2");
    let inputTerminal = document.getElementById("terminal");

    // Get the values from the form fields
    let inputIDValue = inputID.value;
    //let inputNameValue = inputName.value;
    let inputCharacteristicslValue = inputCharacteristics.value;
    let inputTerminalValue = inputTerminal.value;

    // database table for Health Problems does not allow ID to be NULL
    if (isNaN(inputIDValue))
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        problem_ID: inputIDValue,
        //problem_name: inputNameValue,
        problem_characteristics: inputCharacteristicslValue,
        is_terminal: inputTerminalValue,
    }
    //console.log(data)

    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-health-problem-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            console.log('going thru table')
            
            updateRow(xhttp.response, inputIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, problem_ID){
    //let parsedData = data;
    //console.log(parsedData)
    
    let table = document.getElementById("health-problems-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == problem_ID) {

            // Get the location of the row where we found the matching problem ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            console.log(updateRowIndex)
            let td = updateRowIndex.getElementsByTagName("td")[2];
            console.log(td)
            
            //td.innerHTML = parsedData[0].name
       }
    }
}