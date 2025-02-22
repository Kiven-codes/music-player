let currentSongIndex = 0;
let currentGroup = [];
let isPlaying = false;

function playSong(song, image, title, index) {
    var audioPlayer = document.getElementById('audio-player');
    var imageDisplay = document.getElementById('image-display');
    var imageContainer = document.getElementById('image-container');
    var songTitle = document.getElementById('song-title');
    var songList = document.getElementById('song-list');
    var playPauseButton = document.getElementById('play-pause');
    var seekBar = document.getElementById('seek-bar');
    var currentTime = document.getElementById('current-time');
    var duration = document.getElementById('duration');

    audioPlayer.src = song;
    audioPlayer.play();

    imageDisplay.src = image;
    songTitle.innerText = title;
    imageContainer.style.display = 'block';
    songList.style.display = 'none';

    currentSongIndex = index;
    isPlaying = true;
    playPauseButton.innerHTML = '&#10074;&#10074;';

    audioPlayer.addEventListener('timeupdate', function() {
        var value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        seekBar.value = value;
        currentTime.innerText = formatTime(audioPlayer.currentTime);
        duration.innerText = formatTime(audioPlayer.duration);
    });

    seekBar.addEventListener('input', function() {
        var time = (seekBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = time;
    });
}

function showGroupSongs() {
    var groupSelect = document.getElementById('group-select');
    var selectedGroup = groupSelect.value;

    var groups = document.getElementsByClassName('song-group');
    for (var i = 0; i < groups.length; i++) {
        groups[i].style.display = 'none';
    }

    if (selectedGroup) {
        document.getElementById(selectedGroup).style.display = 'block';
        currentGroup = Array.from(document.getElementById(selectedGroup).getElementsByTagName('button'));
    }
}

function goBack() {
    var imageContainer = document.getElementById('image-container');
    var songList = document.getElementById('song-list');

    imageContainer.style.display = 'none';
    songList.style.display = 'block';
}

function nextSong() {
    if (currentGroup.length > 0) {
        currentSongIndex = (currentSongIndex + 1) % currentGroup.length;
        currentGroup[currentSongIndex].click();
    }
}

function prevSong() {
    if (currentGroup.length > 0) {
        currentSongIndex = (currentSongIndex - 1 + currentGroup.length) % currentGroup.length;
        currentGroup[currentSongIndex].click();
    }
}

function togglePlayPause() {
    var audioPlayer = document.getElementById('audio-player');
    var playPauseButton = document.getElementById('play-pause');

    if (isPlaying) {
        audioPlayer.pause();
        playPauseButton.innerHTML = '&#9654;';
    } else {
        audioPlayer.play();
        playPauseButton.innerHTML = '&#10074;&#10074;';
    }

    isPlaying = !isPlaying;
}

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
}