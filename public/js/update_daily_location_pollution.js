let UpdatePollutionLevelForm = document.getElementById('update-location-pollution-form-ajax');

// Modifying a selected pollution log in Daily Location Pollution
UpdatePollutionLevelForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("log-date-update");
    let inputParticulate = document.getElementById("particulate_update");
    let inputNO2 = document.getElementById("NO2_update");
    let inputPAH = document.getElementById("PAH_update");

    // Get the values from the form fields
    let inputIDValue = inputID.value;
    let particulateValue = inputParticulate.value;
    let NO2Value = inputNO2.value;
    let PAHValue = inputPAH.value;

    // database table for Daily_Location_Pollution does not allow log_date to be NULL
    if (isNaN(inputIDValue))
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        log_date: inputIDValue,
        particulate_level: particulateValue,
        NO2_level: NO2Value,
        PAH_level: PAHValue
    }

    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-location-pollution-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, inputIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, log_date){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("location-pollution-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == log_date) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td = updateRowIndex.getElementsByTagName("td")[3];
            //td.innerHTML = parsedData[0].name
       }
    }
}
