```javascript
/* =========================================
   MOBILE MENU
========================================= */

const menuBtn = document.getElementById("menuBtn");

const navbar = document.querySelector(".navbar");


menuBtn.addEventListener("click", function () {

    navbar.classList.toggle("active");

});


/* =========================================
   EXPLORE BUTTON
========================================= */

const exploreBtn = document.getElementById("exploreBtn");


exploreBtn.addEventListener("click", function () {

    const destinations =
        document.getElementById("destinations");

    destinations.scrollIntoView({
        behavior: "smooth"
    });

});


/* =========================================
   CLOSE MOBILE MENU
   WHEN A NAVIGATION LINK IS CLICKED
========================================= */

const navLinks =
    document.querySelectorAll(".navbar a");


navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navbar.classList.remove("active");

    });

});
```
