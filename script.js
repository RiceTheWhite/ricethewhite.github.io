function getStatus() {
  fetch("https://api.lanyard.rest/v1/users/401649298598658048").then((a) => a.json().then((a) => {
    window.lanyard = a.data
    window.ondataload()
  }))
}

function setStatus() {
  updateText.innerHTML = `Updates in ${secondsUntilUpdate} seconds`

  if (secondsUntilUpdate <= 0) {
    secondsUntilUpdate = 10
  } else {
    secondsUntilUpdate -= 1
    return
  }

  getStatus()

  if (window.lanyard.discord_status != 'offline') {
    statusText.innerHTML = `Online`;
    statusText.style.color = '#00ffaa';

  } else {
    statusText.innerHTML = `Offline`;
    statusText.style.color = '#ff5050';

  }

  if (window.lanyard.listening_to_spotify) {
    const sanitized = window.lanyard.spotify.song.replace(/./gm, function (s) {
      // return "&#" + s.charCodeAt(0) + ";";
      return (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";";
    });
    statusSpotify.innerHTML = `Listening to <a href="https://open.spotify.com/track/${encodeURIComponent(window.lanyard.spotify.track_id)}" class="opacity-50">${sanitized}</a> from <a href="https://open.spotify.com/track/${encodeURIComponent(window.lanyard.spotify.track_id)}">${window.lanyard.spotify.album}</a> by <a href="https://open.spotify.com/track/${encodeURIComponent(window.lanyard.spotify.track_id)}">${window.lanyard.spotify.artist}</a> on <a href="https://open.spotify.com/user/31o3gf5lvfhlzo4xrzsmolk3o26i">my Spotify</a> <br> <img src=${window.lanyard.spotify.album_art_url}>`
  } else {
    statusSpotify.innerHTML = `rais is not listening to anything...`
  }
}


window.ondataload = () => { }

let secondsUntilUpdate = 0

fetch("https://api.lanyard.rest/v1/users/401649298598658048").then((a) => a.json().then((a) => {
  window.lanyard = a.data;
  setInterval(() => {
    setStatus()
  }, 1000);
}))
