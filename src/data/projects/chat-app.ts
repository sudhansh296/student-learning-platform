import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ChatSpace</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- JOIN SCREEN -->
  <div class="join-screen" id="joinScreen">
    <div class="join-card">
      <div class="join-logo">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="12" fill="#5865f2"/>
          <path d="M12 26c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="15" cy="22" r="2" fill="white"/>
          <circle cx="25" cy="22" r="2" fill="white"/>
        </svg>
        <span class="join-logo-name">ChatSpace</span>
      </div>
      <h1 class="join-title">Welcome to ChatSpace</h1>
      <p class="join-sub">Enter a username to start chatting in real time</p>
      <form id="joinForm" class="join-form">
        <label class="join-label" for="usernameInput">Username</label>
        <input
          type="text"
          id="usernameInput"
          class="join-input"
          placeholder="e.g. Alex, Jamie, Taylor"
          maxlength="20"
          autocomplete="off"
          spellcheck="false"
        />
        <div class="join-error" id="joinError"></div>
        <button type="submit" class="join-btn">Join ChatSpace</button>
      </form>
      <p class="join-hint">Rooms available: General, Tech Talk, Random, Design</p>
    </div>
  </div>

  <!-- MAIN APP (hidden until join) -->
  <div class="app" id="app" style="display:none;">

    <!-- SIDEBAR -->
    <aside class="sidebar" id="sidebar">

      <!-- Workspace header -->
      <div class="sidebar-header">
        <div class="workspace-name">ChatSpace</div>
        <div class="sidebar-actions">
          <button class="icon-btn" id="themeToggle" title="Toggle light mode">
            <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Channels section -->
      <div class="sidebar-section">
        <div class="sidebar-section-header">Channels</div>
        <ul class="channel-list" id="channelList"></ul>
      </div>

      <!-- Online Users section -->
      <div class="sidebar-section sidebar-section-users">
        <div class="sidebar-section-header">Online <span class="online-count" id="onlineCount">0</span></div>
        <ul class="user-list" id="userList"></ul>
      </div>

      <!-- Current user footer -->
      <div class="sidebar-footer">
        <div class="user-avatar sm" id="selfAvatar"></div>
        <div class="sidebar-footer-info">
          <span class="sidebar-username" id="selfUsername"></span>
          <span class="sidebar-status">Online</span>
        </div>
      </div>

    </aside>

    <!-- MAIN CHAT PANEL -->
    <main class="chat-panel">

      <!-- Channel header -->
      <div class="chat-header">
        <div class="chat-header-left">
          <span class="chat-hash">#</span>
          <span class="chat-channel-name" id="chatChannelName">general</span>
          <span class="chat-channel-desc" id="chatChannelDesc"></span>
        </div>
        <div class="chat-header-right">
          <span class="members-badge" id="membersBadge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span id="memberCount">0</span>
          </span>
        </div>
      </div>

      <!-- Messages area -->
      <div class="messages-area" id="messagesArea">
        <div class="messages-list" id="messagesList"></div>
      </div>

      <!-- Typing indicator -->
      <div class="typing-bar" id="typingBar" style="display:none;">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
        <span class="typing-text" id="typingText"></span>
      </div>

      <!-- Message input -->
      <div class="input-area">
        <form class="input-form" id="messageForm">
          <input
            type="text"
            id="messageInput"
            class="message-input"
            placeholder="Message #general"
            maxlength="500"
            autocomplete="off"
            spellcheck="false"
          />
          <button type="submit" class="send-btn" id="sendBtn" title="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
      </div>

    </main>

  </div>

  <script src="script.js"></script>
</body>
</html>`;

const styleCss = `/* =============================================
   ChatSpace - Dark Discord/Slack-inspired Chat
   ============================================= */

/* ---- CSS VARIABLES ---- */
:root {
  --sidebar-bg: #1a1d21;
  --sidebar-hover: #25282d;
  --sidebar-active: #35383e;
  --sidebar-text: #b9bbbe;
  --sidebar-text-active: #ffffff;
  --sidebar-header-text: #8e9297;
  --main-bg: #313338;
  --message-bg: #313338;
  --message-hover-bg: #2e3035;
  --header-bg: #313338;
  --header-border: #1e1f22;
  --input-bg: #383a40;
  --input-border: #1e1f22;
  --text-primary: #dcddde;
  --text-muted: #8e9297;
  --text-faint: #6d6f78;
  --accent: #5865f2;
  --accent-hover: #4752c4;
  --accent-light: rgba(88,101,242,0.15);
  --online-green: #3ba55c;
  --system-color: #8e9297;
  --reaction-bg: rgba(88,101,242,0.12);
  --reaction-border: rgba(88,101,242,0.3);
  --shadow: 0 2px 10px rgba(0,0,0,0.4);
  --radius: 8px;
  --radius-sm: 4px;
  --transition: 0.15s ease;
  --unread-color: #ed4245;
}

[data-theme="light"] {
  --sidebar-bg: #2f3136;
  --sidebar-hover: #36393f;
  --sidebar-active: #3d4046;
  --sidebar-text: #96989d;
  --sidebar-text-active: #ffffff;
  --sidebar-header-text: #8e9297;
  --main-bg: #ffffff;
  --message-bg: #ffffff;
  --message-hover-bg: #f2f3f5;
  --header-bg: #ffffff;
  --header-border: #e3e5e8;
  --input-bg: #ebedef;
  --input-border: #e3e5e8;
  --text-primary: #2e3338;
  --text-muted: #4f5660;
  --text-faint: #8e9297;
  --accent-light: rgba(88,101,242,0.1);
  --system-color: #6d6f78;
  --reaction-bg: rgba(88,101,242,0.08);
  --shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* ---- RESET ---- */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 15px; height: 100%; }
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  height: 100%;
  overflow: hidden;
  background: var(--main-bg);
  color: var(--text-primary);
  line-height: 1.4;
  transition: background var(--transition), color var(--transition);
}

/* ---- JOIN SCREEN ---- */
.join-screen {
  position: fixed;
  inset: 0;
  background: #111214;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.join-card {
  background: #2b2d31;
  border-radius: 16px;
  padding: 40px 36px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  text-align: center;
}

.join-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.join-logo-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.join-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.join-sub {
  font-size: 13px;
  color: #96989d;
  margin-bottom: 24px;
  line-height: 1.5;
}

.join-form {
  text-align: left;
}

.join-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #b9bbbe;
  margin-bottom: 6px;
}

.join-input {
  width: 100%;
  padding: 11px 14px;
  background: #1e1f22;
  border: 1.5px solid #1e1f22;
  border-radius: var(--radius-sm);
  color: #dcddde;
  font-size: 15px;
  font-family: inherit;
  outline: none;
  transition: border-color var(--transition);
  margin-bottom: 6px;
}

.join-input:focus {
  border-color: var(--accent);
}

.join-input::placeholder {
  color: #5d6166;
}

.join-error {
  font-size: 12px;
  color: #ed4245;
  min-height: 18px;
  margin-bottom: 8px;
}

.join-btn {
  width: 100%;
  padding: 12px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background var(--transition), transform var(--transition);
}

.join-btn:hover {
  background: var(--accent-hover);
}

.join-btn:active {
  transform: scale(0.98);
}

.join-hint {
  font-size: 12px;
  color: #5d6166;
  margin-top: 16px;
}

/* ---- APP LAYOUT ---- */
.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ---- SIDEBAR ---- */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: background var(--transition);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 48px;
  border-bottom: 1px solid rgba(0,0,0,0.3);
  flex-shrink: 0;
}

.workspace-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--sidebar-text-active);
}

.icon-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--sidebar-text);
  cursor: pointer;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition), background var(--transition);
}

.icon-btn:hover {
  color: var(--sidebar-text-active);
  background: var(--sidebar-hover);
}

[data-theme="dark"] .icon-moon { display: none; }
[data-theme="light"] .icon-sun { display: none; }
[data-theme="dark"] .icon-sun { display: block; }
[data-theme="light"] .icon-moon { display: block; }

/* ---- SIDEBAR SECTIONS ---- */
.sidebar-section {
  padding: 16px 0 8px;
  flex-shrink: 0;
}

.sidebar-section-users {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 0;
}

.sidebar-section-header {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--sidebar-header-text);
  padding: 0 16px 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.online-count {
  background: var(--online-green);
  color: white;
  border-radius: 99px;
  font-size: 10px;
  padding: 1px 6px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: none;
}

/* ---- CHANNEL LIST ---- */
.channel-list {
  list-style: none;
}

.channel-item {
  display: flex;
  align-items: center;
  padding: 3px 8px 3px 16px;
  cursor: pointer;
  border-radius: var(--radius-sm);
  margin: 0 8px;
  transition: background var(--transition), color var(--transition);
  position: relative;
}

.channel-item:hover {
  background: var(--sidebar-hover);
  color: var(--sidebar-text-active);
}

.channel-item.active {
  background: var(--sidebar-active);
  color: var(--sidebar-text-active);
}

.channel-hash {
  font-size: 16px;
  color: var(--sidebar-text);
  margin-right: 6px;
  flex-shrink: 0;
  font-weight: 500;
}

.channel-item.active .channel-hash,
.channel-item:hover .channel-hash {
  color: var(--sidebar-text-active);
}

.channel-name-text {
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--sidebar-text);
}

.channel-item.active .channel-name-text,
.channel-item:hover .channel-name-text {
  color: var(--sidebar-text-active);
}

.channel-unread {
  background: var(--unread-color);
  color: white;
  border-radius: 99px;
  font-size: 10px;
  font-weight: 800;
  padding: 1px 5px;
  min-width: 18px;
  text-align: center;
  flex-shrink: 0;
}

/* ---- USER LIST ---- */
.user-list {
  list-style: none;
  padding: 0 8px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  cursor: default;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
  position: relative;
}

.user-avatar.sm {
  width: 28px;
  height: 28px;
  font-size: 11px;
}

.online-dot {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  background: var(--online-green);
  border: 2px solid var(--sidebar-bg);
  border-radius: 50%;
}

.user-item-name {
  font-size: 13px;
  color: var(--sidebar-text);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-item-role {
  font-size: 10px;
  color: var(--sidebar-header-text);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
}

/* ---- SIDEBAR FOOTER ---- */
.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(0,0,0,0.2);
  flex-shrink: 0;
}

.sidebar-footer-info {
  display: flex;
  flex-direction: column;
}

.sidebar-username {
  font-size: 13px;
  font-weight: 700;
  color: var(--sidebar-text-active);
}

.sidebar-status {
  font-size: 11px;
  color: var(--online-green);
  font-weight: 500;
}

/* ---- CHAT PANEL ---- */
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--main-bg);
  transition: background var(--transition);
}

/* ---- CHAT HEADER ---- */
.chat-header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--header-border);
  background: var(--header-bg);
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  transition: background var(--transition), border-color var(--transition);
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-hash {
  font-size: 20px;
  color: var(--text-muted);
  font-weight: 700;
  line-height: 1;
}

.chat-channel-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.chat-channel-desc {
  font-size: 13px;
  color: var(--text-muted);
  border-left: 1px solid var(--header-border);
  padding-left: 10px;
  margin-left: 4px;
}

.members-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

/* ---- MESSAGES AREA ---- */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  scroll-behavior: smooth;
}

.messages-area::-webkit-scrollbar {
  width: 8px;
}

.messages-area::-webkit-scrollbar-track {
  background: transparent;
}

.messages-area::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.08);
  border-radius: 4px;
}

.messages-list {
  padding: 0 16px 8px;
}

/* ---- MESSAGE ITEM ---- */
.message-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background var(--transition);
  margin: 0 -8px;
}

.message-item:hover {
  background: var(--message-hover-bg);
}

.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
  margin-top: 1px;
}

.msg-body {
  flex: 1;
  min-width: 0;
}

.msg-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 3px;
}

.msg-username {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.msg-time {
  font-size: 11px;
  color: var(--text-faint);
  font-weight: 400;
}

.msg-text {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
  word-break: break-word;
}

.msg-reactions {
  display: flex;
  gap: 4px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.reaction-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: var(--reaction-bg);
  border: 1px solid var(--reaction-border);
  border-radius: 99px;
  font-size: 12px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition);
  font-family: inherit;
  font-weight: 600;
}

.reaction-btn:hover {
  background: rgba(88,101,242,0.25);
  border-color: var(--accent);
  color: var(--accent);
}

.reaction-btn.reacted {
  background: rgba(88,101,242,0.2);
  border-color: var(--accent);
  color: var(--accent);
}

.reaction-count {
  font-size: 12px;
  font-weight: 700;
}

.react-add-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 22px;
  background: var(--reaction-bg);
  border: 1px solid var(--reaction-border);
  border-radius: 99px;
  font-size: 13px;
  cursor: pointer;
  color: var(--text-muted);
  transition: all var(--transition);
  font-family: inherit;
}

.react-add-btn:hover {
  background: rgba(88,101,242,0.2);
  color: var(--accent);
  border-color: var(--accent);
}

.message-item:hover .react-add-btn {
  display: inline-flex;
}

/* ---- SYSTEM MESSAGE ---- */
.system-message {
  text-align: center;
  font-size: 12px;
  color: var(--system-color);
  font-style: italic;
  padding: 6px 0;
  margin: 2px 0;
}

/* ---- DATE DIVIDER ---- */
.date-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 0 10px;
}

.date-divider::before,
.date-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--header-border);
}

.date-divider-text {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-faint);
  white-space: nowrap;
}

/* ---- TYPING INDICATOR ---- */
.typing-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 24px 2px;
  min-height: 28px;
}

.typing-dots {
  display: flex;
  gap: 3px;
  align-items: center;
}

.typing-dots span {
  width: 5px;
  height: 5px;
  background: var(--text-muted);
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}

.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}

.typing-text {
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
}

/* ---- INPUT AREA ---- */
.input-area {
  padding: 0 16px 16px;
  flex-shrink: 0;
}

.input-form {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--input-bg);
  border-radius: var(--radius);
  padding: 4px 4px 4px 16px;
  border: 1px solid var(--input-border);
  transition: border-color var(--transition), background var(--transition);
}

.input-form:focus-within {
  border-color: var(--accent);
}

.message-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-primary);
  padding: 8px 0;
  min-height: 36px;
}

.message-input::placeholder {
  color: var(--text-faint);
}

.send-btn {
  width: 36px;
  height: 36px;
  background: var(--accent);
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background var(--transition), transform var(--transition);
}

.send-btn:hover {
  background: var(--accent-hover);
}

.send-btn:active {
  transform: scale(0.92);
}

/* ---- MESSAGE SLIDE IN ---- */
@keyframes msgIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.message-item.new {
  animation: msgIn 0.2s ease forwards;
}

/* ---- SCROLLBAR (Firefox) ---- */
.messages-area {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.08) transparent;
}

/* ---- RESPONSIVE ---- */
@media (max-width: 600px) {
  .sidebar {
    width: 200px;
  }
  .chat-channel-desc {
    display: none;
  }
}`;

const scriptJs = `// =======================================================
// ChatSpace - Simulated Multi-User Chat App
// Features: rooms, bots, typing indicator, reactions,
//           unread badges, dark mode, preloaded history
// =======================================================

// ---- AVATAR COLOR PALETTE ----
var AVATAR_COLORS = [
  '#5865f2', '#57f287', '#fee75c', '#eb459e',
  '#ed4245', '#3ba55c', '#faa61a', '#00b0f4'
];

function avatarColor(name) {
  var sum = 0;
  for (var i = 0; i < name.length; i++) { sum += name.charCodeAt(i); }
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function initials(name) {
  var parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// ---- CHANNEL DEFINITIONS ----
var CHANNELS = [
  {
    id: 'general',
    name: 'general',
    desc: 'General discussion for everyone',
    bot: 'Atlas',
    botRole: 'Community Bot',
    replies: [
      'That is a great point! Happy to chat more about it.',
      'Totally agree. Anyone else have thoughts on this?',
      'Welcome to the conversation! Feel free to ask anything.',
      'Interesting perspective. I had not thought of it that way.',
      'Nice one! This channel always has the best discussions.',
      'Let me know if you need anything. Always here to help.',
      'Good to see activity in General! Keep it coming.',
      'That reminds me of something I read recently. Very cool.'
    ]
  },
  {
    id: 'tech',
    name: 'tech-talk',
    desc: 'Programming, tools, and all things tech',
    bot: 'CodeBot',
    botRole: 'Tech Assistant',
    replies: [
      'Have you tried using a Map instead of a plain object for that?',
      'That pattern is very common in functional programming.',
      'Pro tip: always handle the null case before iterating.',
      'Async/await makes that so much cleaner than callbacks.',
      'Nice approach. You could also consider memoizing the result.',
      'That is a classic O(n^2) problem. A hash map can bring it to O(n).',
      'CSS Grid would handle that layout much easier than flexbox here.',
      'Have you looked at the new native dialog element for that use case?',
      'TypeScript would catch that kind of error at compile time.',
      'Interesting! Reminds me of the observer pattern.'
    ]
  },
  {
    id: 'random',
    name: 'random',
    desc: 'Off-topic, memes, and fun stuff',
    bot: 'Ziggy',
    botRole: 'Fun Bot',
    replies: [
      'Ha, that is wild. Classic Random behavior.',
      'I did not expect that on a Monday. Or any day.',
      'No context needed. This is Random after all.',
      'Could be worse. Could also be much weirder.',
      'Respect. The commitment is unmatched.',
      'Anyone else just casually agree with everything here?',
      'This channel never disappoints. Gold every time.',
      'I was going to say something but this is better.'
    ]
  },
  {
    id: 'design',
    name: 'design',
    desc: 'UI, UX, typography, and visual work',
    bot: 'Pixel',
    botRole: 'Design Bot',
    replies: [
      'That color palette has great contrast. Did you check WCAG compliance?',
      'The 8-point grid system would bring a lot more consistency here.',
      'Whitespace is underrated. Sometimes less truly is more.',
      'What typeface are you using? The line height looks really balanced.',
      'The visual hierarchy guides the eye nicely from top to bottom.',
      'Have you run this through a color-blindness simulator?',
      'That border radius choice feels very intentional. Nice touch.',
      'Dark mode support really comes down to picking the right token system early.',
      'Micro-interactions can make such a difference in perceived quality.',
      'The feedback loop between design and engineering really speeds things up.'
    ]
  }
];

// ---- PRELOADED MESSAGES PER CHANNEL ----
function buildPreloadedMessages() {
  var now = Date.now();
  var data = {};

  data['general'] = [
    { id: 'g1', type: 'system', text: 'Atlas joined General', ts: now - 3600000 },
    { id: 'g2', type: 'msg', username: 'Atlas', text: 'Hey everyone, welcome to ChatSpace! Grab a seat and say hi.', ts: now - 3500000, reactions: {} },
    { id: 'g3', type: 'msg', username: 'Mara', text: 'Thanks! This place looks great. Love the dark theme.', ts: now - 3400000, reactions: { thumbsup: ['Atlas'] } },
    { id: 'g4', type: 'msg', username: 'Atlas', text: 'There is also a light mode if you hit the toggle up top.', ts: now - 3300000, reactions: {} }
  ];

  data['tech'] = [
    { id: 't1', type: 'system', text: 'CodeBot joined Tech Talk', ts: now - 7200000 },
    { id: 't2', type: 'msg', username: 'CodeBot', text: 'Welcome to Tech Talk! What are you all building these days?', ts: now - 7100000, reactions: {} },
    { id: 't3', type: 'msg', username: 'Rory', text: 'Working on a WebSocket chat app, actually. The irony is not lost.', ts: now - 7000000, reactions: { thumbsup: ['CodeBot'] } },
    { id: 't4', type: 'msg', username: 'Sam', text: 'I have been deep in CSS Grid lately. Finally clicked for me.', ts: now - 6900000, reactions: {} },
    { id: 't5', type: 'msg', username: 'CodeBot', text: 'Grid is fantastic once it clicks. Have you tried subgrid yet?', ts: now - 6800000, reactions: {} }
  ];

  data['random'] = [
    { id: 'r1', type: 'system', text: 'Ziggy joined Random', ts: now - 5400000 },
    { id: 'r2', type: 'msg', username: 'Ziggy', text: 'Random is open. No rules. Well, one rule: be weird.', ts: now - 5300000, reactions: {} },
    { id: 'r3', type: 'msg', username: 'Jordan', text: 'Someone just asked if they could sort a linked list in O(1). We are off to a great start.', ts: now - 5200000, reactions: { thumbsup: ['Ziggy', 'Dev'] } },
    { id: 'r4', type: 'msg', username: 'Ziggy', text: 'Peak energy. This channel is going to be fine.', ts: now - 5100000, reactions: {} }
  ];

  data['design'] = [
    { id: 'd1', type: 'system', text: 'Pixel joined Design', ts: now - 9000000 },
    { id: 'd2', type: 'msg', username: 'Pixel', text: 'Designers! Drop your current projects. Let us give each other feedback.', ts: now - 8900000, reactions: {} },
    { id: 'd3', type: 'msg', username: 'Alex', text: 'Just finished a dashboard redesign. Going for that calm, airy feel.', ts: now - 8800000, reactions: { thumbsup: ['Pixel'] } },
    { id: 'd4', type: 'msg', username: 'Pixel', text: 'Nice. Are you using a consistent spacing system or eyeballing it?', ts: now - 8700000, reactions: {} },
    { id: 'd5', type: 'msg', username: 'Alex', text: 'Mostly the 8pt grid. Still dialing in the typography scale.', ts: now - 8600000, reactions: { thumbsup: ['Pixel'] } }
  ];

  return data;
}

// ---- APP STATE ----
var state = {
  username: '',
  currentChannelId: 'general',
  channels: {},     // id -> { ...channelDef, messages: [], unread: 0 }
  typingTimer: null,
  botTimers: {}
};

// ---- INIT ----
function init() {
  // Build channel state
  CHANNELS.forEach(function(ch) {
    state.channels[ch.id] = Object.assign({}, ch, { messages: [], unread: 0 });
  });

  // Load preloaded messages
  var preloaded = buildPreloadedMessages();
  CHANNELS.forEach(function(ch) {
    state.channels[ch.id].messages = preloaded[ch.id] || [];
  });

  // Theme
  var savedTheme = localStorage.getItem('chatspace_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Attach join form
  document.getElementById('joinForm').addEventListener('submit', handleJoin);

  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

// ---- JOIN ----
function handleJoin(e) {
  e.preventDefault();
  var val = document.getElementById('usernameInput').value.trim();
  var errEl = document.getElementById('joinError');

  if (!val) {
    errEl.textContent = 'Please enter a username.';
    return;
  }
  if (val.length < 2) {
    errEl.textContent = 'Username must be at least 2 characters.';
    return;
  }

  // Check if name collides with a bot
  var botNames = CHANNELS.map(function(ch) { return ch.bot.toLowerCase(); });
  if (botNames.indexOf(val.toLowerCase()) !== -1) {
    errEl.textContent = 'That name is taken by a bot. Try another.';
    return;
  }

  errEl.textContent = '';
  state.username = val;

  // Hide join screen, show app
  document.getElementById('joinScreen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';

  // Set self info in sidebar
  var av = document.getElementById('selfAvatar');
  av.textContent = initials(val);
  av.style.background = avatarColor(val);

  document.getElementById('selfUsername').textContent = val;

  // Attach app events
  attachAppEvents();

  // Switch to general (default)
  switchChannel('general');

  // Post join system message to general
  postSystemMessage('general', val + ' joined General');
}

// ---- ATTACH EVENTS ----
function attachAppEvents() {
  // Message form
  document.getElementById('messageForm').addEventListener('submit', handleSend);

  // Enter key already triggers submit on form — no extra listener needed

  // Channel clicks (event delegation)
  document.getElementById('channelList').addEventListener('click', function(e) {
    var item = e.target.closest('.channel-item');
    if (!item) return;
    var id = item.getAttribute('data-channel-id');
    if (id) switchChannel(id);
  });
}

// ---- THEME ----
function toggleTheme() {
  var cur = document.documentElement.getAttribute('data-theme');
  var next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('chatspace_theme', next);

  // Update online-dot border color on avatar
  document.querySelectorAll('.online-dot').forEach(function(dot) {
    dot.style.borderColor = '';
  });
}

// ---- SWITCH CHANNEL ----
function switchChannel(channelId) {
  var ch = state.channels[channelId];
  if (!ch) return;

  // Clear unread for new channel
  ch.unread = 0;
  state.currentChannelId = channelId;

  // Update sidebar active state
  document.querySelectorAll('.channel-item').forEach(function(el) {
    el.classList.toggle('active', el.getAttribute('data-channel-id') === channelId);
  });

  // Update header
  document.getElementById('chatChannelName').textContent = ch.name;
  document.getElementById('chatChannelDesc').textContent = ch.desc;

  // Update input placeholder
  document.getElementById('messageInput').placeholder = 'Message #' + ch.name;

  // Update member count (bot + current user)
  updateMemberCount(channelId);

  // Render messages
  renderMessages(channelId);

  // Update sidebar unread badges
  renderSidebar();

  // Update user list for this channel
  renderUserList(channelId);

  // Focus input
  setTimeout(function() {
    document.getElementById('messageInput').focus();
  }, 50);
}

// ---- UPDATE MEMBER COUNT ----
function updateMemberCount(channelId) {
  // Always: bot + current user = 2 members per channel
  document.getElementById('memberCount').textContent = '2';
}

// ---- POST SYSTEM MESSAGE ----
function postSystemMessage(channelId, text) {
  var ch = state.channels[channelId];
  if (!ch) return;
  ch.messages.push({
    id: 'sys-' + Date.now() + '-' + Math.random(),
    type: 'system',
    text: text,
    ts: Date.now()
  });
  if (channelId === state.currentChannelId) {
    renderMessages(channelId);
  }
}

// ---- SEND MESSAGE ----
function handleSend(e) {
  e.preventDefault();
  var input = document.getElementById('messageInput');
  var text = input.value.trim();
  if (!text) return;

  input.value = '';

  var channelId = state.currentChannelId;
  var msg = {
    id: 'msg-' + Date.now() + '-' + Math.random(),
    type: 'msg',
    username: state.username,
    text: text,
    ts: Date.now(),
    reactions: {},
    isNew: true
  };

  state.channels[channelId].messages.push(msg);
  renderMessages(channelId);
  scrollToBottom();

  // Trigger bot reply
  scheduleBotReply(channelId, text);
}

// ---- BOT REPLY ----
function scheduleBotReply(channelId, userText) {
  var ch = state.channels[channelId];
  if (!ch) return;

  // Show typing indicator after 600ms
  var typingDelay = 600 + Math.random() * 400;
  var replyDelay = 1500 + Math.random() * 700;

  // Cancel any pending bot timer for this channel
  if (state.botTimers[channelId]) {
    clearTimeout(state.botTimers[channelId]);
  }

  state.botTimers[channelId] = setTimeout(function() {
    // Show typing
    if (channelId === state.currentChannelId) {
      showTyping(ch.bot + ' is typing...');
    }

    // Reply after typing duration
    state.botTimers[channelId] = setTimeout(function() {
      hideTyping();

      // Pick a reply
      var replies = ch.replies;
      var reply = replies[Math.floor(Math.random() * replies.length)];

      var botMsg = {
        id: 'bot-' + Date.now() + '-' + Math.random(),
        type: 'msg',
        username: ch.bot,
        text: reply,
        ts: Date.now(),
        reactions: {},
        isNew: true
      };

      ch.messages.push(botMsg);

      if (channelId === state.currentChannelId) {
        renderMessages(channelId);
        scrollToBottom();
      } else {
        // Increment unread
        ch.unread = (ch.unread || 0) + 1;
        renderSidebar();
      }
    }, replyDelay - typingDelay);
  }, typingDelay);
}

// ---- TYPING INDICATOR ----
function showTyping(text) {
  var bar = document.getElementById('typingBar');
  document.getElementById('typingText').textContent = text;
  bar.style.display = 'flex';
}

function hideTyping() {
  document.getElementById('typingBar').style.display = 'none';
}

// ---- REACTIONS ----
function toggleReaction(channelId, msgId) {
  var ch = state.channels[channelId];
  if (!ch) return;

  var msg = ch.messages.find(function(m) { return m.id === msgId; });
  if (!msg || msg.type !== 'msg') return;

  if (!msg.reactions) msg.reactions = {};

  var reacters = msg.reactions['thumbsup'] || [];
  var idx = reacters.indexOf(state.username);

  if (idx === -1) {
    reacters.push(state.username);
  } else {
    reacters.splice(idx, 1);
  }

  if (reacters.length === 0) {
    delete msg.reactions['thumbsup'];
  } else {
    msg.reactions['thumbsup'] = reacters;
  }

  renderMessages(channelId);
  // Preserve scroll position — don't scroll to bottom on reaction
}

// ---- RENDER SIDEBAR ----
function renderSidebar() {
  var list = document.getElementById('channelList');
  list.innerHTML = '';

  CHANNELS.forEach(function(chDef) {
    var ch = state.channels[chDef.id];
    var li = document.createElement('li');
    li.className = 'channel-item' + (chDef.id === state.currentChannelId ? ' active' : '');
    li.setAttribute('data-channel-id', chDef.id);

    var hash = document.createElement('span');
    hash.className = 'channel-hash';
    hash.textContent = '#';

    var name = document.createElement('span');
    name.className = 'channel-name-text';
    name.textContent = ch.name;

    li.appendChild(hash);
    li.appendChild(name);

    // Unread badge
    if (ch.unread > 0 && chDef.id !== state.currentChannelId) {
      var badge = document.createElement('span');
      badge.className = 'channel-unread';
      badge.textContent = ch.unread > 9 ? '9+' : ch.unread;
      li.appendChild(badge);
    }

    list.appendChild(li);
  });
}

// ---- RENDER USER LIST ----
function renderUserList(channelId) {
  var ch = state.channels[channelId];
  var list = document.getElementById('userList');
  list.innerHTML = '';

  var users = [
    { name: state.username, role: 'You' },
    { name: ch.bot, role: ch.botRole }
  ];

  users.forEach(function(u) {
    var li = document.createElement('li');
    li.className = 'user-item';

    var av = document.createElement('div');
    av.className = 'user-avatar sm';
    av.textContent = initials(u.name);
    av.style.background = avatarColor(u.name);

    var dot = document.createElement('div');
    dot.className = 'online-dot';
    av.appendChild(dot);

    var info = document.createElement('div');
    info.style.cssText = 'display:flex;flex-direction:column;overflow:hidden;';

    var nameEl = document.createElement('span');
    nameEl.className = 'user-item-name';
    nameEl.textContent = u.name;

    var roleEl = document.createElement('span');
    roleEl.className = 'user-item-role';
    roleEl.textContent = u.role;

    info.appendChild(nameEl);
    info.appendChild(roleEl);
    li.appendChild(av);
    li.appendChild(info);
    list.appendChild(li);
  });

  document.getElementById('onlineCount').textContent = users.length;
}

// ---- FORMAT TIME ----
function formatTime(ts) {
  var d = new Date(ts);
  var h = d.getHours();
  var m = d.getMinutes();
  var ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
}

function formatDate(ts) {
  var d = new Date(ts);
  var months = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function isSameDay(ts1, ts2) {
  var d1 = new Date(ts1);
  var d2 = new Date(ts2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

// ---- RENDER MESSAGES ----
function renderMessages(channelId) {
  if (channelId !== state.currentChannelId) return;

  var ch = state.channels[channelId];
  var container = document.getElementById('messagesList');

  // Preserve scroll position if user has scrolled up
  var area = document.getElementById('messagesArea');
  var isAtBottom = area.scrollHeight - area.scrollTop - area.clientHeight < 60;

  container.innerHTML = '';

  var prevTs = null;

  ch.messages.forEach(function(msg) {
    // Date divider
    if (prevTs === null || !isSameDay(prevTs, msg.ts)) {
      var div = document.createElement('div');
      div.className = 'date-divider';
      var txt = document.createElement('span');
      txt.className = 'date-divider-text';
      txt.textContent = isToday(msg.ts) ? 'Today' : formatDate(msg.ts);
      div.appendChild(txt);
      container.appendChild(div);
    }
    prevTs = msg.ts;

    if (msg.type === 'system') {
      var sysEl = document.createElement('div');
      sysEl.className = 'system-message';
      sysEl.textContent = msg.text;
      container.appendChild(sysEl);
      return;
    }

    // Regular message
    var item = buildMessageEl(msg, channelId);
    container.appendChild(item);
  });

  if (isAtBottom) {
    scrollToBottom();
  }
}

function isToday(ts) {
  return isSameDay(ts, Date.now());
}

// ---- BUILD MESSAGE ELEMENT ----
function buildMessageEl(msg, channelId) {
  var item = document.createElement('div');
  item.className = 'message-item' + (msg.isNew ? ' new' : '');
  if (msg.isNew) {
    // Remove new flag after one render so it does not re-animate
    setTimeout(function() { msg.isNew = false; }, 300);
  }

  // Avatar
  var av = document.createElement('div');
  av.className = 'msg-avatar';
  av.textContent = initials(msg.username);
  av.style.background = avatarColor(msg.username);

  // Body
  var body = document.createElement('div');
  body.className = 'msg-body';

  // Header
  var header = document.createElement('div');
  header.className = 'msg-header';

  var uname = document.createElement('span');
  uname.className = 'msg-username';
  uname.textContent = msg.username;

  var time = document.createElement('span');
  time.className = 'msg-time';
  time.textContent = formatTime(msg.ts);

  header.appendChild(uname);
  header.appendChild(time);

  // Text
  var textEl = document.createElement('div');
  textEl.className = 'msg-text';
  textEl.textContent = msg.text;

  body.appendChild(header);
  body.appendChild(textEl);

  // Reactions row
  var reactRow = document.createElement('div');
  reactRow.className = 'msg-reactions';

  // Thumbs up reaction
  var thumbsupCount = (msg.reactions && msg.reactions['thumbsup']) ? msg.reactions['thumbsup'].length : 0;
  var hasReacted = msg.reactions && msg.reactions['thumbsup'] && msg.reactions['thumbsup'].indexOf(state.username) !== -1;

  if (thumbsupCount > 0) {
    var reactBtn = document.createElement('button');
    reactBtn.className = 'reaction-btn' + (hasReacted ? ' reacted' : '');
    reactBtn.setAttribute('title', hasReacted ? 'Remove reaction' : 'Add reaction');

    var reactLabel = document.createElement('span');
    reactLabel.textContent = '+1';

    var reactCountEl = document.createElement('span');
    reactCountEl.className = 'reaction-count';
    reactCountEl.textContent = thumbsupCount;

    reactBtn.appendChild(reactLabel);
    reactBtn.appendChild(reactCountEl);

    // Capture msgId in closure
    (function(mId) {
      reactBtn.addEventListener('click', function() {
        toggleReaction(channelId, mId);
      });
    })(msg.id);

    reactRow.appendChild(reactBtn);
  }

  // Add reaction button (shown on hover via CSS)
  var addReactBtn = document.createElement('button');
  addReactBtn.className = 'react-add-btn';
  addReactBtn.title = 'Add +1 reaction';
  addReactBtn.textContent = '+1';

  (function(mId) {
    addReactBtn.addEventListener('click', function() {
      toggleReaction(channelId, mId);
    });
  })(msg.id);

  reactRow.appendChild(addReactBtn);

  body.appendChild(reactRow);

  item.appendChild(av);
  item.appendChild(body);

  return item;
}

// ---- SCROLL TO BOTTOM ----
function scrollToBottom() {
  var area = document.getElementById('messagesArea');
  setTimeout(function() {
    area.scrollTop = area.scrollHeight;
  }, 20);
}

// ---- START ----
init();
renderSidebar();`;

export const chatAppProject: Project = {
  id: 'chat-app',
  slug: 'chat-app',
  title: 'Real-time Chat App',
  difficulty: 'advanced',
  type: 'frontend',
  estimatedTime: '15-25 hours',
  description: 'Build a fully simulated multi-user chat app with rooms, bot replies, typing indicators, reactions, unread badges, and dark mode — all running in the browser with plain HTML, CSS, and JavaScript.',
  technologies: ['HTML', 'CSS', 'JavaScript', 'WebSockets'],
  prerequisites: [
    'Comfortable with DOM manipulation',
    'JavaScript array methods and closures',
    'CSS custom properties',
    'Basic event handling'
  ],
  learnings: [
    'Simulating real-time multi-user behavior in the browser',
    'State management without a framework',
    'Event-driven architecture with timers',
    'Dynamic DOM rendering from data',
    'CSS variables for instant theme switching',
    'Closure patterns for event listeners in loops',
    'Scroll management and scroll position preservation',
    'Unread notification patterns'
  ],
  features: [
    'Username join screen with validation',
    'Four chat rooms: General, Tech Talk, Random, Design',
    'Bot user per room auto-replies after a typing delay',
    'Typing indicator with animated dots',
    'Message reactions with +1 thumbs up count',
    'Unread message badges on inactive rooms',
    'Online user list in sidebar',
    'Pre-loaded message history in every room',
    'System messages on join',
    'Dark and light mode toggle persisted to localStorage',
    'Smooth scroll to bottom on new messages',
    'Date dividers in the message list'
  ],
  fileStructure: 'chat-app/\n  index.html\n  style.css\n  script.js',
  overview: 'A chat app is one of the most instructive frontend projects you can build. It forces you to think about real-time state: messages arriving, typing events, unread counts, room switching. In a real production app this would use WebSockets (Socket.io or the native WebSocket API) and a backend server. Here we simulate all of that in the browser using timers and in-memory state — every concept maps directly to how the real thing works. Master this and WebSocket integration becomes a matter of swapping setTimeout for socket.on().',
  objective: 'Build a production-quality chat app UI that simulates multi-user real-time behavior entirely in the browser, then extend it with WebSocket support.',
  files: [
    { path: 'chat-app/index.html', language: 'html', content: indexHtml },
    { path: 'chat-app/style.css', language: 'css', content: styleCss },
    { path: 'chat-app/script.js', language: 'javascript', content: scriptJs },
  ],
  lessons: [
    {
      id: 'architecture',
      title: 'Structuring State for a Chat App',
      explanation: 'A chat app has more moving parts than a to-do list. Before touching the DOM, define the full state object: the current user, the active channel, all channels as a map (id to channel data), and per-channel message arrays. Keeping all mutable data in one place — a single state object — makes it easy to reason about what changes and why. This mirrors the Redux/Zustand pattern used in React apps: one source of truth, pure render functions that read from it.',
      js: `// The entire app state lives here
var state = {
  username: '',          // the current user's name
  currentChannelId: 'general',
  channels: {
    // 'general' -> { id, name, bot, messages: [], unread: 0 }
  },
  typingTimer: null,
  botTimers: {}          // per-channel timer handles
};

// Channels are initialised from a static definition array
var CHANNELS = [
  { id: 'general', name: 'general', bot: 'Atlas', replies: [...] },
  { id: 'tech',    name: 'tech-talk', bot: 'CodeBot', replies: [...] },
  ...
];

function init() {
  CHANNELS.forEach(function(ch) {
    state.channels[ch.id] = Object.assign({}, ch, { messages: [], unread: 0 });
  });
  // load preloaded history, attach events, render sidebar
}`,
    },
    {
      id: 'bot-simulation',
      title: 'Simulating Real-time Bot Replies',
      explanation: 'The bot simulation is what makes the app feel alive. When the user sends a message, we schedule two timers: one to show the typing indicator after ~600ms, and a second to post the bot reply after ~1.5 seconds. Each channel has its own bot with a pool of context-appropriate replies picked at random. If the user types again before the bot replies we clear the pending timer and restart it so you never get two bot replies stacking. This cancellation pattern is the same debounce technique used for search inputs.',
      js: `function scheduleBotReply(channelId) {
  var ch = state.channels[channelId];

  // Cancel any pending reply for this channel
  if (state.botTimers[channelId]) {
    clearTimeout(state.botTimers[channelId]);
  }

  var typingDelay = 600 + Math.random() * 400;   // 600-1000ms
  var replyDelay  = 1500 + Math.random() * 700;  // 1500-2200ms total

  state.botTimers[channelId] = setTimeout(function() {
    // Show "Bot is typing..."
    if (channelId === state.currentChannelId) {
      showTyping(ch.bot + ' is typing...');
    }

    state.botTimers[channelId] = setTimeout(function() {
      hideTyping();

      var reply = ch.replies[Math.floor(Math.random() * ch.replies.length)];

      ch.messages.push({
        id: 'bot-' + Date.now(),
        type: 'msg',
        username: ch.bot,
        text: reply,
        ts: Date.now(),
        reactions: {},
        isNew: true
      });

      if (channelId === state.currentChannelId) {
        renderMessages(channelId);
        scrollToBottom();
      } else {
        ch.unread++;    // badge the other channel
        renderSidebar();
      }
    }, replyDelay - typingDelay);
  }, typingDelay);
}`,
    },
    {
      id: 'reactions',
      title: 'Building Message Reactions',
      explanation: 'Reactions are stored as an object on each message: reactions["thumbsup"] is an array of usernames who reacted. Toggling works by checking if the current username is already in the array. If yes, splice it out (un-react). If no, push it in (react). If the array empties, delete the key entirely. Then re-render the messages list. The re-render replaces the entire list in one pass, which is simpler than trying to update one message in isolation. The "add reaction" button on hover is a pure CSS trick using .message-item:hover .react-add-btn { display: inline-flex; }.',
      js: `function toggleReaction(channelId, msgId) {
  var ch = state.channels[channelId];
  var msg = ch.messages.find(function(m) { return m.id === msgId; });
  if (!msg) return;

  if (!msg.reactions) msg.reactions = {};

  var reacters = msg.reactions['thumbsup'] || [];
  var idx = reacters.indexOf(state.username);

  if (idx === -1) {
    reacters.push(state.username);    // react
  } else {
    reacters.splice(idx, 1);          // un-react
  }

  if (reacters.length === 0) {
    delete msg.reactions['thumbsup']; // clean up empty entry
  } else {
    msg.reactions['thumbsup'] = reacters;
  }

  renderMessages(channelId);
  // Note: we do NOT scroll to bottom on reaction clicks
  // so the user stays in place
}`,
    },
    {
      id: 'unread-badges',
      title: 'Unread Message Badges',
      explanation: 'When a bot reply arrives in a channel the user is NOT currently viewing, we increment ch.unread and call renderSidebar() to update the badge. When the user switches to that channel, switchChannel() resets unread to zero and re-renders the sidebar. The badge is only shown if unread > 0 AND the channel is not active. This is the same pattern used in every chat app from Slack to iMessage.',
      js: `// In scheduleBotReply:
if (channelId === state.currentChannelId) {
  renderMessages(channelId);  // show message immediately
  scrollToBottom();
} else {
  ch.unread++;          // user is elsewhere — mark unread
  renderSidebar();      // badge will appear
}

// In switchChannel:
function switchChannel(channelId) {
  var ch = state.channels[channelId];
  ch.unread = 0;                  // clear on visit
  state.currentChannelId = channelId;
  renderMessages(channelId);
  renderSidebar();               // remove badge
  renderUserList(channelId);
}

// In renderSidebar:
if (ch.unread > 0 && chDef.id !== state.currentChannelId) {
  var badge = document.createElement('span');
  badge.className = 'channel-unread';
  badge.textContent = ch.unread > 9 ? '9+' : ch.unread;
  li.appendChild(badge);
}`,
    },
    {
      id: 'rendering',
      title: 'Rendering Messages Efficiently',
      explanation: 'renderMessages() rebuilds the entire message list from the channel\'s messages array. Before clearing innerHTML, it checks whether the user has scrolled up (more than 60px from the bottom). If they have, it preserves their scroll position after re-rendering. If they are at the bottom, it scrolls to show the new message. The "new" flag on a message triggers a slide-in CSS animation on first render only — we remove the flag with a small timeout so it does not animate again on the next re-render.',
      js: `function renderMessages(channelId) {
  if (channelId !== state.currentChannelId) return;

  var ch = state.channels[channelId];
  var container = document.getElementById('messagesList');
  var area = document.getElementById('messagesArea');

  // Remember if user is at the bottom before wiping
  var isAtBottom = area.scrollHeight - area.scrollTop - area.clientHeight < 60;

  container.innerHTML = ''; // clear and rebuild

  var prevTs = null;

  ch.messages.forEach(function(msg) {
    // Insert date divider when the date changes
    if (prevTs === null || !isSameDay(prevTs, msg.ts)) {
      container.appendChild(buildDateDivider(msg.ts));
    }
    prevTs = msg.ts;

    if (msg.type === 'system') {
      container.appendChild(buildSystemMsgEl(msg.text));
    } else {
      container.appendChild(buildMessageEl(msg, channelId));
    }
  });

  if (isAtBottom) scrollToBottom();
}

function scrollToBottom() {
  var area = document.getElementById('messagesArea');
  setTimeout(function() { area.scrollTop = area.scrollHeight; }, 20);
}`,
    },
    {
      id: 'css-theming',
      title: 'Discord-style Dark and Light Mode',
      explanation: 'The entire color scheme is driven by CSS custom properties. The dark theme (default) is defined on :root. The light theme overrides only the variables that change under [data-theme="light"]. JavaScript only sets the data-theme attribute on the html element — it never touches individual colors. This means any future color change requires editing CSS only, in one place. The sidebar always stays dark because it targets var(--sidebar-bg) which is a fixed dark color in both themes.',
      css: `/* Default: dark Discord-inspired palette */
:root {
  --sidebar-bg: #1a1d21;
  --main-bg: #313338;
  --input-bg: #383a40;
  --text-primary: #dcddde;
  --text-muted: #8e9297;
  --accent: #5865f2;
  --online-green: #3ba55c;
  --unread-color: #ed4245;
}

/* Light overrides — only what changes */
[data-theme="light"] {
  --main-bg: #ffffff;
  --input-bg: #ebedef;
  --header-border: #e3e5e8;
  --text-primary: #2e3338;
  --text-muted: #4f5660;
  --message-hover-bg: #f2f3f5;
}

/* Sidebar stays dark even in light mode because
   it targets a fixed color, not a variable */
.sidebar {
  background: var(--sidebar-bg);  /* always #1a1d21 */
}

/* Theme toggle shows sun in dark mode, moon in light */
[data-theme="dark"]  .icon-sun  { display: block; }
[data-theme="dark"]  .icon-moon { display: none; }
[data-theme="light"] .icon-sun  { display: none; }
[data-theme="light"] .icon-moon { display: block; }`,
    },
  ],
  challenges: [
    {
      id: 'c1',
      title: 'Replace Simulation with Real WebSockets',
      difficulty: 'hard',
      description: 'Replace the bot timer simulation with a real Node.js + Socket.io server. The client emits send_message, the server broadcasts it to all sockets in the room, and all connected browser windows see it instantly.',
      hint: 'Run "npm install express socket.io" in a server folder. Copy the room and user tracking logic from the original chat-app. Replace scheduleBotReply() with socket.emit("send_message", ...) and add socket.on("new_message", ...) to receive messages. Use io.to(roomId).emit() to broadcast to the room only.',
    },
    {
      id: 'c2',
      title: 'Add Message Persistence with localStorage',
      difficulty: 'medium',
      description: 'Save all channel messages to localStorage so they survive a page refresh. Limit storage to the last 50 messages per channel to prevent unbounded growth.',
      hint: 'Call localStorage.setItem("chatspace_messages", JSON.stringify(allMessages)) after every new message is added. On init, load saved messages and merge them with the preloaded set, deduplicating by id. Slice to the last 50 before saving.',
    },
    {
      id: 'c3',
      title: 'Add Direct Messages',
      difficulty: 'hard',
      description: 'Add a "Direct Messages" section in the sidebar. Clicking a username opens a private one-on-one conversation thread that only shows messages between those two users.',
      hint: 'Add a dms object to state keyed by username. When a user clicks another user\'s name in the user list, setActiveDM(username) and render that thread instead of the channel messages. DM threads get their own input and their own bot-reply simulation.',
    },
    {
      id: 'c4',
      title: 'Add Message Search',
      difficulty: 'medium',
      description: 'Add a search input in the header that filters the message list in real time to only show messages containing the search text, highlighted.',
      hint: 'Add a searchQuery variable in state. On input, update searchQuery and re-render messages. In renderMessages, filter the messages array before rendering. Use a helper to wrap the matching substring in a <mark> element instead of setting textContent directly.',
    },
  ],
};
