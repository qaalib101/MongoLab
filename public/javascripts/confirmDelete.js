// delete button
var deleteButton = document.querySelector('#deleteButton');

// event listener for the delete button
deleteButton.addEventListener('click', function(ev){
    var deleteTasks = confirm("Delete tasks are you sure?");
    // checking to see if delete tasks is confirmed
    if(!deleteTasks){
        ev.preventDefault();
    }
});