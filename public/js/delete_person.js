/* 
    Citation for the following functions:
    Date retrieved: 2/23/2023
    Adapted from OSU NodeJS Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deletePerson(person_ID) {
    let data = {
        id: person_ID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-person-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(person_ID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(person_ID){

    let table = document.getElementById("people-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == person_ID) {
            table.deleteRow(i);
            deleteDropDownMenu(person_ID);
            break;
       }
    }
};

function deleteDropDownMenu(person_ID){
  let selectMenu = document.getElementById("input-person_ID");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(person_ID)){
      selectMenu[i].remove();
      break;
    }
  }
};