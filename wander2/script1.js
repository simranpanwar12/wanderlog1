// =========================
// GET HTML ELEMENTS
// =========================

let form = document.getElementById("tripForm");

let titleInput = document.getElementById("title");

let destinationInput =
    document.getElementById("destination");

let dateInput =
    document.getElementById("date");

let notesInput =
    document.getElementById("notes");

let tripContainer =
    document.getElementById("tripContainer");

let emptyMessage =
    document.getElementById("emptyMessage");


// =========================
// GET DATA FROM LOCALSTORAGE
// =========================

let trips =
    JSON.parse(localStorage.getItem("trips")) || [];


// =========================
// DISPLAY TRIPS ON PAGE LOAD
// =========================

displayTrips();


// =========================
// CREATE - ADD TRIP
// =========================

form.addEventListener("submit", function(event) {

    event.preventDefault();


    // Get form values

    let title = titleInput.value.trim();

    let destination =
        destinationInput.value.trim();

    let date = dateInput.value;

    let notes = notesInput.value.trim();


    // Validation

    if (
        title === "" ||
        destination === "" ||
        date === ""
    ) {

        alert(
            "Please fill in title, destination and date."
        );

        return;
    }


    // Create trip object

    let trip = {

        id: Date.now(),

        title: title,

        destination: destination,

        date: date,

        notes: notes

    };


    // Add trip

    trips.push(trip);


    // Save to LocalStorage

    localStorage.setItem(
        "trips",
        JSON.stringify(trips)
    );


    // Clear form

    form.reset();


    // Show trips

    displayTrips();

});


// =========================
// READ - DISPLAY TRIPS
// =========================

function displayTrips() {

    tripContainer.innerHTML = "";


    // Empty state

    if (trips.length === 0) {

        emptyMessage.style.display = "block";

        return;
    }


    emptyMessage.style.display = "none";


    // Create cards dynamically

    trips.forEach(function(trip) {

        let card =
            document.createElement("div");

        card.className = "trip-card";


        card.innerHTML = `

            <h3>${trip.title}</h3>

            <p>
                <strong>Destination:</strong>
                ${trip.destination}
            </p>

            <p>
                <strong>Date:</strong>
                ${trip.date}
            </p>

            <p>
                <strong>Notes:</strong>
                ${trip.notes}
            </p>

            <button onclick="editTrip(${trip.id})">
                Edit
            </button>

            <button
                class="delete-btn"
                onclick="deleteTrip(${trip.id})">
                Delete
            </button>

        `;


        tripContainer.appendChild(card);

    });

}


// =========================
// UPDATE - EDIT TRIP
// =========================

function editTrip(id) {

    let trip = trips.find(function(item) {

        return item.id === id;

    });


    if (!trip) {

        return;
    }


    // Put old values into form

    titleInput.value = trip.title;

    destinationInput.value =
        trip.destination;

    dateInput.value = trip.date;

    notesInput.value = trip.notes;


    // Remove old trip

    trips = trips.filter(function(item) {

        return item.id !== id;

    });


    // Save changed array

    localStorage.setItem(
        "trips",
        JSON.stringify(trips)
    );


    displayTrips();


    // Scroll to form

    form.scrollIntoView();

}


// =========================
// DELETE - REMOVE TRIP
// =========================

function deleteTrip(id) {

    let answer = confirm(
        "Are you sure you want to delete this trip?"
    );


    if (answer === false) {

        return;
    }


    // Remove selected trip

    trips = trips.filter(function(item) {

        return item.id !== id;

    });


    // Save updated data

    localStorage.setItem(
        "trips",
        JSON.stringify(trips)
    );


    // Update page

    displayTrips();

}