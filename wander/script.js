let button = document.getElementById("exploreBtn");

let message = document.getElementById("message");

button.addEventListener("click", function() {

    message.textContent = "Your adventure starts here! 🌍";

    message.style.color = "#c66b3d";

    button.textContent = "Let's Go!";

});