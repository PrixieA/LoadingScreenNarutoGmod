let slides = document.querySelectorAll(".slide");
let index = 0;

function nextSlide() {
    slides[index].classList.remove("active");

    index = (index + 1) % slides.length;

    slides[index].classList.add("active");
}

// Change toutes les 5 secondes
setInterval(nextSlide, 5000);


// GMod loading text
function GameDetails(servername) {
    document.querySelector("h1").innerText = servername;
}

function SetStatusChanged(status) {
    document.getElementById("status").innerText = status;
}
