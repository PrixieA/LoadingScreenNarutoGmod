let player;
let isMuted = true;

// Charger l'API YouTube
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video');
}

// Bouton mute/unmute
document.getElementById("muteBtn").addEventListener("click", () => {
    if (!player) return;

    if (isMuted) {
        player.unMute();
        document.getElementById("muteBtn").innerText = "🔊 Couper le son";
    } else {
        player.mute();
        document.getElementById("muteBtn").innerText = "🔇 Activer le son";
    }

    isMuted = !isMuted;
});
