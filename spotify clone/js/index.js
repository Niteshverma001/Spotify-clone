console.log('lets write javascript');

let currentSong = new Audio();

function SecondsToMinutesSeconds(seconds) {

    if(isNaN(seconds) || seconds < 0){
        return "invalid input"
    }
    // Calculating minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Adding leading zeros if necessary
    var formattedMinutes = String(minutes).padStart(2, '0');
    var formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    

    let a = await fetch("http://127.0.0.1:3001/songs/")
    let response = await a.text();
    console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs

}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    if(!pause){
        
        currentSong.play()
        play.src = "/svg/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

async function main() {

    let songs = await getSongs();
    playMusic(songs[0], true)


    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="/svg/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Nitesh</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert"  src="/svg/play.svg" alt="">
                            </div>
                        </li>
        
        </li>`;

    }

    // attcah at eventlistner

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    // attach to eventlistner control song 
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "/svg/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "/svg/play.svg"
        }
    })

    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.curenttime, currentSong.duration);

        document.querySelector(".songtime").innerHTML = `${SecondsToMinutesSeconds(currentSong.currentTime)}/${SecondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 +"%";
    })


    //add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=> {
        let percent =  (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent+"%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })


}

main()
