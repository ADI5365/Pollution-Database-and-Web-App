// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-person-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("input-person");
    let inputAge = document.getElementById("input-age");
    let inputCity = document.getElementById("input-city");

    // Get the values from the form fields
    let inputIDValue = inputID.value;
    let inputAgeValue = inputAge.value;
    let inputCityValue = inputCity.value;

    // database table for People does not allow ID + age updating values to be NULL
    if (isNaN(inputIDValue) || isNaN(inputAgeValue))
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        person_ID: inputIDValue,
        age: inputAgeValue,
        location_ID: inputCityValue,
    }

    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-person-ajax", true);
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
    console.log(data)

})


function updateRow(data, person_ID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("people-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == person_ID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td = updateRowIndex.getElementsByTagName("td")[1];
            td.innerHTML = parsedData[0].name
       }
    }
}
