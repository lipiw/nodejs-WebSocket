const socket = io();            //chat.js -> Cliente / socket.ts -> servidor

// Ter acesso as informações que são passadas por parametro
const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
const room = urlSearch.get("select_room");

const usernameDiv = document.getAnimations("username");
usernameDiv.innerHTML = `Olá ${username}, você esta na sala ${room}`;

socket.emit("select_room", {
    username,
    room
}, (messages) => {                //messages é o callback
    messages.forEach(message => createMessage(message))
});

document.getElementById("message_input").addEventListener("keypress", (event) =>{
    if(event.key === "Enter"){
        const message = event.target.value;

        const data = {
            room,
            message,
            username
        };

        socket.emit("message", data);

        event.target.value = "";
    }
});

socket.on("message", data =>{
    createMessage(data);
});

function createMessage(data){
    const messageDiv = document.getElementById("messages");

    messageDiv.innerHTML += `
    <div class="new_message">
    <label class="form-label">
        <strong>${data.username}</strong> <span> ${data.text} - ${dayjs(data.createdAt).format("DD/MM HH:mm")}</span>
    </label>
    </div>`;
}

document.getElementById("logout").addEventListener("click", (event) => {
    window.location.href = "index.html";
})

// Socket io é dividido em duas partes, oq eu quero enviar e o que recebo.
// Se quero enviar algo, uso o emit, caso quero receber algo, "escuto" com o on.