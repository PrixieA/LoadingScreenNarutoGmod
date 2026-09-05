(function () {
  "use strict";
  var c = window.SCR_LOADING || {};
  var slides = document.querySelectorAll(".slide");
  var front = 0, lastImage = null;
  var images = [], failedImages = {};
  var songs = [], failedSongs = {}, lastSong = null;
  var audio = document.getElementById("music");
  var slider = document.getElementById("volume");
  var button = document.getElementById("mute");
  var output = document.getElementById("volume-value");
  var status = document.getElementById("audio-status");
  var rememberedVolume = 30, playRequest = 0;
  var updateDuration = Math.max(1, Number(c.updateDuration) || 30000);
  var imageDuration = Math.max(1, Number(c.imageDuration) || 10000);
  var fadeDuration = Math.max(0, Number(c.fadeDuration) || 0);
  function numbered(count, folder, prefix, extension) {
    var result = [];
    for (var i = 1; i <= Math.min(1000, Math.max(0, Number(count) || 0)); i++) {
      result.push(folder + prefix + i + extension);
    }
    return result;
  }
  images = numbered(c.imageCount, c.imageFolder || "images/", "img", ".png");
  songs = numbered(c.songCount, c.musicFolder || "music/", "song", ".mp3");
  function choose(list, previous, failed) {
    var choices = list.filter(function (file) { return file !== previous && !failed[file]; });
    return choices.length ? choices[Math.floor(Math.random() * choices.length)] : null;
  }
  for (var i = 0; i < slides.length; i++) {
    slides[i].style.backgroundSize = c.imageFit === "cover" ? "cover" : "contain";
    slides[i].style.transitionDuration = fadeDuration + "ms";
  }
  // Pas de test HTTP HEAD : un fichier doit pouvoir être réellement décodé.
  function loadImage(url, done) {
    var image = new Image(), settled = false;
    var timeout = setTimeout(function () { finish(false); }, 15000);
    function finish(ok) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      image.onload = image.onerror = null;
      done(ok);
    }
    image.onload = function () { finish(image.naturalWidth > 0); };
    image.onerror = function () { finish(false); };
    image.src = url;
  }
  function showImage(url) {
    var next = 1 - front;
    slides[next].style.backgroundImage = "url(" + JSON.stringify(url) + ")";
    slides[next].classList.add("visible");
    slides[front].classList.remove("visible");
    front = next;
  }
  // Précharge la prochaine image pendant la durée d'affichage de l'actuelle.
  function scheduleRegular(duration, clearUpdate) {
    var elapsed = false, ready = false, nextImage = null;
    function advance() {
      if (!elapsed || !ready) return;
      if (!nextImage) {
        // Une image ordinaire seule reste affichée, sans fausse répétition.
        if (clearUpdate) slides[front].classList.remove("visible");
        return;
      }
      showImage(nextImage);
      lastImage = nextImage;
      scheduleRegular(imageDuration, false);
    }
    setTimeout(function () {
      elapsed = true;
      // L'image de mise à jour disparaît même si la suivante charge encore.
      if (clearUpdate) slides[front].classList.remove("visible");
      advance();
    }, duration);
    function prepare() {
      nextImage = choose(images, lastImage, failedImages);
      if (!nextImage) { ready = true; advance(); return; }
      loadImage(nextImage, function (ok) {
        if (!ok) { failedImages[nextImage] = true; prepare(); return; }
        ready = true;
        advance();
      });
    }
    prepare();
  }
  loadImage(c.updateImage || "images/imgupdate.png", function (ok) {
    if (ok) { showImage(c.updateImage || "images/imgupdate.png"); scheduleRegular(updateDuration, true); }
    else { scheduleRegular(0, false); }
  });

  function tryPlay() {
    if (!audio.getAttribute("src")) return;
    var request = ++playRequest;
    var result = audio.play();
    if (result && typeof result.catch === "function") {
      result.catch(function (error) {
        if (request !== playRequest || error.name === "AbortError") return;
        if (error.name === "NotAllowedError" && Number(slider.value) > 0) {
          status.textContent = "Cliquez sur le volume pour démarrer la musique.";
        }
        // Les erreurs de fichier sont traitées par l'événement error.
      });
    }
  }
  function nextSong() {
    var next = choose(songs, lastSong, failedSongs);
    if (!next) {
      audio.pause();
      status.textContent = Number(slider.value) > 0 ? "Aucune autre musique disponible." : "";
      return;
    }
    lastSong = next;
    audio.src = next;
    audio.load();
    tryPlay();
  }
  function setVolume(value) {
    value = Math.max(0, Math.min(100, Number(value) || 0));
    if (value > 0) rememberedVolume = value;
    slider.value = value;
    audio.volume = value / 100;
    audio.muted = value === 0;
    output.textContent = value + " %";
    button.setAttribute("aria-pressed", String(value === 0));
    button.setAttribute("aria-label", value === 0 ? "Activer la musique" : "Couper la musique");
    button.title = value === 0 ? "Activer la musique" : "Couper la musique";
    document.getElementById("sound-off").style.display = value === 0 ? "" : "none";
    document.getElementById("sound-on").removeAttribute("hidden");
    document.getElementById("sound-on").style.display = value === 0 ? "none" : "";
    status.textContent = "";
    if (value > 0) {
      if (audio.ended) nextSong();
      else if (audio.getAttribute("src")) tryPlay();
      else nextSong();
    }
  }
  slider.addEventListener("input", function () { setVolume(slider.value); });
  button.addEventListener("click", function () { setVolume(Number(slider.value) > 0 ? 0 : rememberedVolume); });
  audio.addEventListener("ended", nextSong);
  audio.addEventListener("error", function () {
    if (!lastSong) return;
    failedSongs[lastSong] = true;
    nextSong();
  });
  audio.addEventListener("playing", function () { status.textContent = ""; });
  // Ne jamais restaurer un volume précédent : chaque connexion commence muette.
  setVolume(0);
  nextSong();
})();
