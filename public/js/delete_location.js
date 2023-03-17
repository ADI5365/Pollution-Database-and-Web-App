/* 
    Citation for the following functions:
    Date retrieved: 2/23/2023
    Adapted from OSU NodeJS Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteLocation(location_ID) {
    if (confirm("Are you sure you want to delete this location?") === false) {
        return;
    }

    let data = {
        id: location_ID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(location_ID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(location_ID){

    let table = document.getElementById("location-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == location_ID) {
            table.deleteRow(i);
            deleteDropDownMenu(location_ID);
            break;
       }
    }
};

function deleteDropDownMenu(location_ID){
  let selectMenu = document.getElementById("input-location_ID");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(location_ID)){
      selectMenu[i].remove();
      break;
    }
  }
};