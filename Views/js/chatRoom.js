

const massageFrom = document.getElementById('massageForm')
// const chatBox = document.getElementById('chatbox');
// const sender = document.getElementById('sender');
// const senderMsg = document.getElementById('senderMsg');
// const receiver = document.getElementById('receiver');
// const receiverMsg = document.getElementById('receiverMsg');
const divAlert = document.getElementById('div-alert');

massageFrom.addEventListener('submit', async (e) => {
    e.preventDefault();
    let messageText = document.getElementById('messageText').value
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/chat/sendMessage', { messageText }, { headers: { "Authorization": token } });
        if (response.data.message == 'success') {
            await displayNotification('message send Successfully!', 'success', divAlert);
            window.location.reload();
        }
    } catch (error) {
        console.log(error);
        await displayNotification("Internal Server Error!", 'danger', divAlert);

    }

})
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
function showChatBoxMessages(message) {
    // create div for sender msgs
    let messageText = message.messageText;
    let currentTime = message.currentTime;
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token)
    // console.log(decodeToken.userId, message.senderId);
    if (decodeToken.userId == message.senderId) {
        let div1 = document.createElement('div');
        div1.className = 'message sender';
        div1.id = 'sender'
        let div2 = document.createElement('div');
        div2.className = 'message-content';
        div2.id = 'senderMsg'
        div2.textContent = `${messageText} ${' '}`
        let sub = document.createElement('sub')
        sub.textContent = `${currentTime}`

        div2.appendChild(sub);
        div1.appendChild(div2)
        loading.parentNode.insertBefore(div1, loading);
    } else {
        let div1 = document.createElement('div');
        div1.className = 'message receiver';
        div1.id = 'receiver'
        let div2 = document.createElement('div');
        div2.className = 'message-content';
        div2.id = 'receiverMsg'
        div2.textContent = `${messageText} ${' '}`
        let sub = document.createElement('sub')
        sub.textContent = `${currentTime}`

        div2.appendChild(sub);
        div1.appendChild(div2)
        loading.parentNode.insertBefore(div1, loading);
    }

    // // chatBox.appendChild(div1)
    massageFrom.reset();
    // console.log(div1);
}
const readChatBoxMessage = async () => {
    const allMessages = await axios.get('/chat/readMessages')
    console.log(allMessages)
    allMessages.data.forEach((message) => {

        showChatBoxMessages(message)
    })

}
readChatBoxMessage();
// setInterval(readChatBoxMessage, 1000);
function displayNotification(message, type, container) {
    return new Promise((resolve) => {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `alert alert-${type}`;
        notificationDiv.textContent = message;
        container.appendChild(notificationDiv);
        setTimeout(() => {
            notificationDiv.remove();
            resolve();
        }, 2000);
    });
}
