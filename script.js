let currentSongIndex = 0;
let currentGroup = [];
let isPlaying = false;
let currentGroupIndex = 0;
let isRandomPlaying = false;

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Simple authentication check (replace with real authentication logic)
    if (username === 'minispotify' && password === 'MiniSpotify_27') {
        if (rememberMe) {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        } else {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
        }
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('music-player').style.display = 'block';
    } else {
        alert('Invalid username or password');
    }
}

function loadCredentials() {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');

    if (savedUsername && savedPassword) {
        document.getElementById('username').value = savedUsername;
        document.getElementById('password').value = savedPassword;
        document.getElementById('remember-me').checked = true;
    }
}

document.addEventListener('DOMContentLoaded', loadCredentials);

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

    audioPlayer.addEventListener('ended', function() {
        if (isRandomPlaying) {
            playRandomSong();
        } else {
            const nextSongButton = currentGroup[currentSongIndex + 1];
            if (nextSongButton) {
                nextSongButton.click();
            } else {
                switchToNextArtist();
            }
        }
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
        currentGroupIndex = Array.from(groups).indexOf(document.getElementById(selectedGroup));
        document.getElementById('image-container').style.display = 'none';
        document.getElementById('song-list').style.display = 'block';
    }

    // Show the "Play Random" button
    document.getElementById('play-random-button').style.display = 'block';
    isRandomPlaying = false;
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

function switchToNextArtist() {
    var groups = document.getElementsByClassName('song-group');
    groups[currentGroupIndex].style.display = 'none';
    currentGroupIndex = (currentGroupIndex + 1) % groups.length;
    groups[currentGroupIndex].style.display = 'block';

    var groupSelect = document.getElementById('group-select');
    groupSelect.selectedIndex = currentGroupIndex + 1;

    currentGroup = Array.from(groups[currentGroupIndex].getElementsByTagName('button'));
    if (currentGroup.length > 0) {
        currentGroup[0].click();
    }
}

function playRandomSong() {
    var groups = document.getElementsByClassName('song-group');
    var allSongs = [];
    for (var i = 0; i < groups.length; i++) {
        allSongs = allSongs.concat(Array.from(groups[i].getElementsByTagName('button')));
    }
    var randomSong = allSongs[Math.floor(Math.random() * allSongs.length)];
    randomSong.click();

    // Hide the "Play Random" button
    document.getElementById('play-random-button').style.display = 'none';
    isRandomPlaying = true;

    // Set the selected artist in the dropdown
    var selectedGroup = randomSong.closest('.song-group').id;
    var groupSelect = document.getElementById('group-select');
    groupSelect.value = selectedGroup;
}
