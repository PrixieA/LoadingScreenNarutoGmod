// Texte dynamique GMod
function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
    document.querySelector("h1").innerText = servername;
}

// Progression téléchargement
function SetStatusChanged(status) {
    document.getElementById("status").innerText = status;
}
