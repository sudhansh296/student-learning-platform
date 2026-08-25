import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Music Player</title><link rel="stylesheet" href="style.css"></head><body>
<div class="player"><h1>🎵 Music Player</h1><div class="artwork" id="artwork">♪</div><div class="track-info"><h2 id="title">Track Title</h2><p id="artist">Artist Name</p></div><div class="progress-bar"><input type="range" id="progress" min="0" max="100" value="0"><div class="time-display"><span id="current">0:00</span><span id="duration">0:00</span></div></div><div class="controls"><button id="btnPrev">⏮</button><button id="btnPlay">▶</button><button id="btnNext">⏭</button></div><div class="volume-control"><span>🔊</span><input type="range" id="volume" min="0" max="100" value="70"></div><div class="playlist" id="playlist"></div></div>
<script src="script.js"></script></body></html>`;

const styleCss = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.player{background:#fff;border-radius:20px;padding:40px;max-width:400px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3)}h1{text-align:center;color:#667eea;margin-bottom:30px}.artwork{width:200px;height:200px;margin:0 auto 20px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:4rem;color:#fff}.track-info{text-align:center;margin-bottom:20px}h2{font-size:1.5rem;margin-bottom:5px}p{color:#666}.progress-bar{margin-bottom:20px}input[type=range]{width:100%;-webkit-appearance:none;height:6px;border-radius:5px;background:#e5e7eb;outline:0}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#667eea;cursor:pointer}.time-display{display:flex;justify-content:space-between;font-size:.85rem;color:#999;margin-top:5px}.controls{display:flex;justify-content:center;gap:20px;margin-bottom:20px}.controls button{width:60px;height:60px;border:none;background:#667eea;color:#fff;border-radius:50%;font-size:1.5rem;cursor:pointer;transition:transform .2s}#btnPlay{width:70px;height:70px;font-size:2rem}.controls button:hover{transform:scale(1.1)}.volume-control{display:flex;align-items:center;gap:10px;margin-bottom:20px}.volume-control input{flex:1}.playlist{max-height:200px;overflow-y:auto}.playlist-item{padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:8px;cursor:pointer;transition:background .2s}.playlist-item:hover{background:#e5e7eb}.playlist-item.active{background:#667eea;color:#fff}.playlist-item strong{display:block;margin-bottom:3px}.playlist-item span{font-size:.85rem;opacity:.8}`;

const scriptJs = `const tracks=[{title:'Summer Vibes',artist:'Artist 1',duration:180},{title:'Night Drive',artist:'Artist 2',duration:200},{title:'Morning Coffee',artist:'Artist 3',duration:165}];let currentTrack=0,isPlaying=!1,audio=new Audio,currentTime=0,duration=0;const title=document.getElementById('title'),artist=document.getElementById('artist'),btnPlay=document.getElementById('btnPlay'),btnPrev=document.getElementById('btnPrev'),btnNext=document.getElementById('btnNext'),progress=document.getElementById('progress'),currentTimeEl=document.getElementById('current'),durationEl=document.getElementById('duration'),volume=document.getElementById('volume'),playlist=document.getElementById('playlist');function loadTrack(e){currentTrack=e;const t=tracks[e];title.textContent=t.title,artist.textContent=t.artist,durationEl.textContent=formatTime(t.duration),duration=t.duration,renderPlaylist()}function play(){isPlaying=!0,btnPlay.textContent='⏸',startTimer()}function pause(){isPlaying=!1,btnPlay.textContent='▶',stopTimer()}function togglePlay(){isPlaying?pause():play()}function next(){currentTrack=(currentTrack+1)%tracks.length,loadTrack(currentTrack),isPlaying&&play()}function prev(){currentTrack=(currentTrack-1+tracks.length)%tracks.length,loadTrack(currentTrack),isPlaying&&play()}function startTimer(){timer=setInterval(()=>{currentTime++,currentTime>=duration&&(currentTime=0,next()),updateProgress()},1e3)}function stopTimer(){clearInterval(timer)}function updateProgress(){progress.value=duration>0?currentTime/duration*100:0,currentTimeEl.textContent=formatTime(currentTime)}function formatTime(e){const t=Math.floor(e/60),r=e%60;return t+':'+r.toString().padStart(2,'0')}function renderPlaylist(){playlist.innerHTML=tracks.map((e,t)=>\`<div class="playlist-item \${t===currentTrack?'active':''}" onclick="selectTrack(\${t})"><strong>\${e.title}</strong><span>\${e.artist} • \${formatTime(e.duration)}</span></div>\`).join('')}window.selectTrack=function(e){loadTrack(e),isPlaying&&play()};btnPlay.addEventListener('click',togglePlay),btnNext.addEventListener('click',next),btnPrev.addEventListener('click',prev),progress.addEventListener('input',e=>{const t=parseInt(e.target.value);currentTime=Math.floor(duration*(t/100)),updateProgress()}),volume.addEventListener('input',e=>{audio.volume=parseInt(e.target.value)/100}),loadTrack(0),renderPlaylist();`;

export const musicPlayerProject: Project = {
  id: 'music-player',
  slug: 'music-player',
  title: 'Music Player',
  difficulty: 'advanced',
  type: 'frontend',
  estimatedTime: '8–12 hours',
  playgroundKey: 'music-player',
  description: 'Build a feature-rich music player with playlist, play/pause controls, track navigation, progress bar, volume control, and track metadata display. Includes timer simulation and playlist management.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['Advanced JavaScript', 'Audio API basics', 'setInterval/clearInterval', 'Event handling'],
  learnings: ['Audio playback control', 'Progress bar implementation', 'Playlist management', 'Time formatting', 'Volume control', 'State management', 'UI synchronization', 'Event coordination'],
  features: ['Play/pause/next/previous controls', 'Track progress bar', 'Volume slider', 'Playlist with track selection', 'Current time and duration display', 'Active track highlighting', 'Circular artwork display', 'Auto-play next track'],
  fileStructure: 'music-player/\n  index.html\n  style.css\n  script.js',
  overview: 'A music player demonstrates audio control, playlist management, and real-time UI updates. This project simulates playback with timers and manages track switching, progress tracking, and volume control.',
  objective: 'Build a complete music player with playback controls, progress tracking, playlist, and volume management.',
  files: [
    { path: 'music-player/index.html', language: 'html', content: indexHtml },
    { path: 'music-player/style.css', language: 'css', content: styleCss },
    { path: 'music-player/script.js', language: 'javascript', content: scriptJs },
  ],
  lessons: [
    { id: 'audio-control', title: 'Audio Playback Control', explanation: 'Control audio playback with play(), pause(), and track switching. Manage timer for progress updates and handle track completion.', js: 'function play() { isPlaying = true; startTimer(); }' },
    { id: 'progress-tracking', title: 'Progress Bar Sync', explanation: 'Sync progress bar with playback time. Update every second and allow seeking by dragging the progress bar.', js: 'function updateProgress() { progress.value = (currentTime / duration) * 100; }' },
  ],
  challenges: [
    { id: 'shuffle-repeat', title: 'Add Shuffle and Repeat', description: 'Add shuffle mode (random track order) and repeat modes (one/all). Toggle buttons with active states.', hint: 'Create shuffled index array. Track repeat mode state. Check mode before next track.', difficulty: 'medium' },
    { id: 'equalizer', title: 'Add Visual Equalizer', description: 'Create animated equalizer bars that move with music. Use canvas or CSS animations.', hint: 'Create array of random bar heights. Animate with setInterval. Update every 100ms.', difficulty: 'hard' },
  ],
  github: { owner: 'webdev-atlas', repo: 'music-player', branch: 'main', url: 'https://github.com/webdev-atlas/music-player' },
};
