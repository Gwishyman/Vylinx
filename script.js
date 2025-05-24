function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const encrypted = btoa(password);
  localStorage.setItem('vylinx_user', JSON.stringify({ username, encrypted }));
  window.location.href = 'servers.html';
}

function checkLogin() {
  const user = JSON.parse(localStorage.getItem('vylinx_user'));
  if (!user) {
    window.location.href = 'index.html';
  }
}

function sendMessage(server) {
  const input = document.getElementById('message');
  const text = input.value;
  if (!text) return;
  const chatBox = document.getElementById('chat-box');
  const user = JSON.parse(localStorage.getItem('vylinx_user'));
  const msg = `${user.username}: ${text}`;
  chatBox.innerHTML += `<div>${msg}</div>`;
  input.value = '';

  let messages = JSON.parse(localStorage.getItem(server)) || [];
  messages.push(msg);
  localStorage.setItem(server, JSON.stringify(messages));
}

function loadMessages(server) {
  const chatBox = document.getElementById('chat-box');
  const messages = JSON.parse(localStorage.getItem(server)) || [];
  messages.forEach(m => chatBox.innerHTML += `<div>${m}</div>`);
}

function clearMessages(server) {
  if (confirm("Are you sure you want to clear the chat?")) {
    localStorage.removeItem(server);
    const chatBox = document.getElementById('chat-box');
    if (chatBox) chatBox.innerHTML = '';
  }
}
