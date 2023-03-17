/* 
    Citation for the following functions:
    Date retrieved: 2/23/2023
    Adapted from OSU NodeJS Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteCityHealthIssue(city_health_ID) {
    if (confirm("Are you sure you want to delete this city health issue?") === false) {
        return;
    }

    let data = {
      id: city_health_ID
    };
  
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-city-health-issue-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(city_health_ID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(city_health_ID){

    let table = document.getElementById("city-health-issues-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == city_health_ID) {
            table.deleteRow(i);
            break;
       }
    }
};