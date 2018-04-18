// delete button
var deleteButton = document.querySelector('#delete-all-done');

// event listener for the delete button
deleteButton.addEventListener('click', function(ev){
    var okToDelete = confirm("Delete tasks are you sure?");
    // checking to see if delete tasks is confirmed
    if(!okToDelete){
        ev.preventDefault();
    }
});