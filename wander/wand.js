// Get the button

let button = document.getElementById("exploreBtn");


// Get the message paragraph

let message = document.getElementById("message");


// Add click event to button

button.addEventListener("click", function() {

    message.textContent = "Your adventure starts here! 🌍";

    message.style.color = "#c66b3d";

});