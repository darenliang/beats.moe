/**
 * Set viewport height
 */

function setViewportHeight() {
    document.documentElement.style.setProperty("--vh", window.innerHeight / 100 + "px");
}

setViewportHeight();
window.addEventListener("resize", setViewportHeight);

/**
 * Volume control
 */

let volume = 50;
const volumeStored = localStorage.getItem("volume");
if (volumeStored === null) {
    localStorage.setItem("volume", "50");
} else {
    volume = parseInt(volumeStored, 10);
}

document.getElementById("volume-control").value = volume;
document.getElementById("video").volume = volume / 100;

window.setVolume = function (val) {
    const video = document.getElementById("video");
    localStorage.setItem("volume", val);
    video.volume = val / 100;
};

/**
 * Helpers
 */

function generateString(len) {
    let text = "";
    let charset = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}

async function getSong() {
    try {
        const random = generateString(12);
        const query = await fetch(`https://openings.moe/api/details.php?seed=${random}`);
        if (query.status !== 200) {
            return await getSong();
        }
        return await query.json();
    } catch {
        return await getSong();
    }
}

function getTitle(song) {
    if (song.artist && song.title) {
        return `${song.artist} - ${song.title}`;
    } else if (song.title) {
        return song.title;
    } else if (song.artist) {
        return song.artist;
    } else {
        return "Song name not found";
    }
}

function loadSong(details) {
    const video = document.getElementById("video");
    video.src = `https://openings.moe/video/${details.data.file}.webm`;
    video.load();
}


/**
 * Start music loop
 */

async function start() {
    const details = await getSong();
    console.log(details);

    const title = getTitle(details.data.song);

    loadSong(details);

    const date = new Date();
    const elapsed = date.getTime() - time;

    setTimeout(async function () {
        document.getElementById("text").innerHTML = title;
        document.title = title;

        try {
            await document.getElementById("video").play();
            document.getElementById("warning-box").remove();
        } catch {
            function play() {
                document.getElementById("video").play();
                document.getElementById("warning-box").remove();
                removeListeners();
            }

            function removeListeners() {
                document.removeEventListener("keydown", play);
                document.removeEventListener("mousedown", play);
            }

            document.addEventListener("keydown", play);
            document.addEventListener("mousedown", play);

            document.getElementById("warning").style.visibility = "visible";
        }

    }, 2000 - elapsed);

    document.getElementById("video").onended = async () => {
        const details = await getSong();
        loadSong(details);
        console.log(details);

        const title = getTitle(details.data.song);
        document.getElementById("text").innerHTML = title;
        document.title = title;

        document.getElementById("video").play();
    };
}

const date = new Date();
const time = date.getTime();
start();
