async function start() {
    const response = await fetch("https://openings.moe/api/list.php");
    const list = await response.json();

    let song;
    while (true) {
        song = list[Math.floor(Math.random() * list.length)];

        if (song.song && song.uid) {
            break;
        }
    }

    const query = await fetch(`https://openings.moe/api/details.php?name=${song.uid}`);
    const details = await query.json();

    const title = (() => {
        if (details.song.artist && details.song.title) {
            return `${details.song.artist} - ${details.song.title}`;
        } else if (details.song.title) {
            return details.song.title;
        } else if (details.song.artist) {
            return details.song.artist;
        } else {
            return "Song name not found";
        }
    })();

    document.getElementById("video").src = `https://openings.moe/video/${details.file}.webm`;
    document.getElementById("video").load();

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
}

const date = new Date();
const time = date.getTime();
start();