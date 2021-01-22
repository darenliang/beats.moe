/**
 * Set viewport height
 */

function setViewportHeight() {
    document.documentElement.style.setProperty("--vh", window.innerHeight / 100 + "px");
}

setViewportHeight();
window.addEventListener("resize", setViewportHeight);

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
    let details;
    do {
        const random = generateString(12);
        const query = await fetch(`https://openings.moe/api/details.php?seed=${random}`);
        details = await query.json();
    } while (!details.song || !details.file);

    return details;
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
    document.getElementById("video").src = `https://openings.moe/video/${details.file}.webm`;
    document.getElementById("video").load();
}


/**
 * Start music loop
 */

async function start() {
    const details = await getSong();
    console.log(details);

    const title = getTitle(details.song);

    loadSong(details);

    const date = new Date();
    const elapsed = date.getTime() - time;

    setTimeout(async function () {
        document.getElementById("text").innerHTML = title;

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
        document.getElementById("text").innerHTML = getTitle(details.song);
        document.getElementById("video").play();
    };
}

const date = new Date();
const time = date.getTime();
start();