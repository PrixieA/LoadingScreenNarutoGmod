let player;
let isMuted = true;

// Charger API Dailymotion
let tag = document.createElement('script');
tag.src = "https://api.dmcdn.net/all.js";
document.body.appendChild(tag);

function onload() {
    player = DM.player(document.getElementById("video"));
}

// Bouton
document.getElementById("muteBtn").addEventListener("click", () => {
    if (!player) return;

    if (isMuted) {
        player.setMuted(false);
        document.getElementById("muteBtn").innerText = "🔊 Couper le son";
    } else {
        player.setMuted(true);
        document.getElementById("muteBtn").innerText = "🔇 Activer le son";
    }

    isMuted = !isMuted;
});
