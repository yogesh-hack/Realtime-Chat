//! call the socket server
const socket = io()

do{
    name = prompt("Enter your name : ")
}while(!name)
const uname = document.getElementsByClassName('name')
uname.innerHTML = name
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

// Icons made by Freepik from www.flaticon.com

const PERSON_IMG = "https://www.w3schools.com/howto/img_avatar.png";

msgerForm.addEventListener("submit", event => {
  event.preventDefault();
  const msgText = msgerInput.value;
  if (!msgText) return;
  let msg = {
    user : name,
    message:msgText,
  }
  fetchmessage(msg)
  appendMessage(name, PERSON_IMG, "right", msgText);
  msgerInput.value = "";
  socket.emit('message',msg)
  // sync with mongodb
  sincWithdb(msg)
});

// api call to mongodb
function sincWithdb(msg) {
  const headers = {
    'Content-Type' : 'application/json',
  }
  fetch('/api/messages', { method : 'Post', body: JSON.stringify(msg), headers})
    .then(response => response.json())
      .then(result => {
        console.log(result)
      })
}

function fetchmessage(msg) {
  fetch('/api/messages')
    .then(res => res.json())
    .then(result => {
      result.forEach((messages) => {
        messages.time = messages.createdAt
        appendMessage(messages.username,PERSON_IMG,"left",messages.message)
      })
      console.log(result)
    })
}


 window.onload = fetchmessage
function appendMessage(name, img, side, text) {
  const markup = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time"><small>${moment().format('LT')}</small></div>
        </div>
        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", markup);
  msgerChat.scrollTop += 500;
}

function botResponse(msg) {
  const msgText = msg;
  appendMessage(msg.user, PERSON_IMG, "left", msg.message);
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}


// recieved the messages form server

socket.on('message',(msg) => {
  botResponse(msg)
})
let activated = false;
let emojiBtn = document.getElementById("emoji");
let emojiList = [
  "👍",
  "👌",
  "👏",
  "🙏",
  "🆗",
  "🙂",
  "😀",
  "😃",
  "😉",
  "😊",
  "😋",
  "😌",
  "😏",
  "😐",
  "😑",
  "😒",
  "😓",
  "😂",
  "🤣",
  "😅",
  "😆",
  "😜",
  "😹",
  "🚶",
  "👫",
  "👬",
  "👭",
  "😙",
  "😘",
  "🏠",
  "👆",
  "🖕",
  "👋",
  "👎",
  "👈",
  "👉"
];
emojiList.forEach(element => {
  let list = document.getElementById("emoji-list");
  let node = document.createElement("span");
  node.classList.add("emoji");
  node.textContent = element;
  node.onclick = ev => {
    msgerInput.value += node.textContent;
  };
  list.appendChild(node);
});

emojiBtn.onclick = function(evt) {
  activated = !activated;

  let list = document.getElementById("emoji-list");
  if (activated) {
    list.style.display = "flex  ";
  } else {
    list.style.display = "none";
  }
};