const playButton = document.getElementById('play');
const playIcon = playButton.querySelector('img');
const seekSlider = document.getElementById('seek-slider');
const audio = document.querySelector('audio');
const audioCont = document.getElementById('wrapper');
const currTimeDiv = document.getElementById('curr-time');
const durationDiv = document.getElementById('duration');
const unskipButton = document.getElementById('unskip');
const skipButton = document.getElementById('skip');

const song = document.getElementById('song-title');
const artist = document.getElementById('artist');
const cover = document.getElementById('song-cover');

const playlist = [
    {
        src: './assets/lost-in-city-lights-145038.mp3',
        title: 'Lost in City Lights',
        artist: 'Artist A',
        cover: './assets/cover-1.png'
    },
    {
        src: './assets/forest-lullaby-110624.mp3',
        title: 'Forest Lullaby',
        artist: 'Artist B',
        cover: './assets/cover-2.png'
    }
];

let currSongIdx = 0;
let isPlaying = false;

// Load song based on the provided index
const loadSong = (index) => {
    const currSong = playlist[index];
    audio.src = song.src;
    song.textContent = currSong.title;
    artist.textContent = currSong.artist;
    cover.src = currSong.cover;
    audio.load();
    seekSlider.value = 0;
    audioCont.style.setProperty('--seek-before-width', '0%');
    currTimeDiv.textContent = '0:00';
};

// Toggle play/pause
playButton.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playIcon.src = './assets/Play_fill.svg';
    } else {
        audio.play();
        playIcon.src = './assets/Stop_fill.svg';
    }
    isPlaying = !isPlaying;
});

// Restart current song
unskipButton.addEventListener('click', () => {
    audio.currentTime = 0;
    if (!audio.paused) {
        audio.play();
    }
});

// Play the next song in the playlist
skipButton.addEventListener('click', () => {
    currSongIdx = (currSongIdx + 1) % playlist.length;
    loadSong(currSongIdx);

    // Listen for metadata to ensure audio is ready
    audio.addEventListener('loadedmetadata', () => {
        if (isPlaying) {
            audio.play();
        }
    }, { once: true });
});

loadSong(currSongIdx);

// Update seek slider and duration when metadata is loaded
audio.addEventListener('loadedmetadata', () => {
    seekSlider.max = Math.floor(audio.duration);
    durationDiv.textContent = calcTime(audio.duration);
});

// Update current time and slider position during play
audio.addEventListener('timeupdate', () => {
    seekSlider.value = Math.floor(audio.currentTime);
    currTimeDiv.textContent = calcTime(audio.currentTime);
    audioCont.style.setProperty('--seek-before-width', `${(seekSlider.value / seekSlider.max) * 100}%`);
});

// Seek to specific time in song when slider is adjusted
seekSlider.addEventListener('input', () => {
    audio.currentTime = seekSlider.value;
    currTimeDiv.textContent = calcTime(seekSlider.value);
});

// Convert time to proper format (MM:SS)
const calcTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const formattedSecs = seconds < 10 ? `0${seconds}` : seconds;
    return `${mins}:${formattedSecs}`;
};