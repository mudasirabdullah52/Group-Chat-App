
const massageFrom = document.getElementById('massageForm')
const chatBox = document.getElementById('chatbox');
const createGroup = document.getElementById('createGroup')
const divAlert = document.getElementById('div-alert');
const userList = document.getElementById('userList');
const groupsList = document.getElementById('groupsList');
const groupbtn = document.getElementById('groupbtn');
const chatBot = document.getElementById('chatBot');
const updateGroupList = document.getElementById('updateGroupList')
const createGroupModal = document.getElementById('createGroupModal')
const groupHeader = document.getElementById('groupHeader');
const editgroup = document.getElementById('editgroup');
const profile = document.getElementById('profile');
const profileDetails = document.getElementById('profileDetails')

const socket = io(window.location.origin);
socket.on('group-message', (Id) => {
    const groupId = Id.currentGroupId;
    const name = Id.currentGroupName
    readChatBoxMessage(groupId, name);
    // if (groupId == Id) {

    // }
})

profile.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/user/profileDetails`, { headers: { "Authorization": token } });
    const user = response.data;
    profileDetails.innerHTML = "";
    profileDetails.innerHTML = `
                         <tr>
                            <td>Name:</td>
                            <td>${user.name}</td>
                        </tr>
                        <tr>
                            <td>Email:</td>
                            <td>${user.email}</td>
                        </tr>
                        <tr>
                            <td>Phone:</td>
                            <td>${user.phoneNo}</td>
                        </tr>
    `

    $('#profileModel').modal('show');

})

// Show All UserS of the  user Groups 
const showAllUserGroups = async () => {
    try {
        // groupsList.innerHTML = ""
        const token = localStorage.getItem('token');
        const groupsResponse = await axios.get(`/user/usergroups`, { headers: { "Authorization": token } });
        const userGroups = groupsResponse.data;

        userGroups.forEach(group => {

            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-success d-flex justify-content-between groupName mb-1'
            li.appendChild(document.createTextNode(group.name));

            const groupbtn = document.createElement('button');
            groupbtn.className = 'badge bg-primary rounded-pill info'
            groupbtn.innerHTML = 'info';
            li.appendChild(groupbtn)
            groupsList.appendChild(li)

            li.onclick = (e) => {
                if (e.target.classList.contains('groupName')) {
                    const obj = { currentGroupId: group.id, currentGroupName: group.name }
                    const groupinfo = JSON.stringify(obj);
                    localStorage.setItem('groupinfo', groupinfo)
                    // console.log(localStorage.getItem(currentGroupId))
                    readChatBoxMessage(group.id, group.name);
                }
                else {
                    updateUserGroup(group.id, group.AdminId);
                }
            }
        })

    } catch (error) {

        console.log(error)

    }
}
showAllUserGroups();

// Show user of a particular group  
const updateUserGroup = async (groupId, AdminId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/user/showUsersOfGroup/${groupId}`, { headers: { "Authorization": token } });
    const updateGroupData = response.data;
    // Creating remove button  
    const removeBtn = document.createElement('button');

    const decodeToken = parseJwt(token)
    updateGroupData.forEach(user => {
        const li = document.createElement('li');
        li.className = 'list-group-item list-group-item-success d-flex justify-content-between groupName mb-1'
        li.appendChild(document.createTextNode(user.name));

        if (user.id === AdminId) {
            const AdminBtn = document.createElement('span');
            AdminBtn.className = 'badge bg-warning rounded-pill warning'
            AdminBtn.innerHTML = 'Admin';
            li.appendChild(AdminBtn)
        }
        else {

            removeBtn.className = 'badge bg-danger rounded-pill info'
            removeBtn.innerHTML = 'delete';
            li.appendChild(removeBtn)
        }
        updateGroupList.appendChild(li)
        console.log(user.name)

        // remove User from the group
        removeBtn.onclick = (e) => {
            console.log(groupId, user.id)
        }
    });
    console.log(updateGroupData)
    $('#updateModel').modal('show');



}

// show all user 

const showallUsers = async () => {
    const response = await axios.get('/user/getUsers')
    userList.innerHTML = "";
    response.data.forEach(user => {
        userList.innerHTML += `                                    
                     <div class="list-group mb-3">
                                    <label class="list-group-item" id="checkLable">
                                        <input class="form-check-input me-1" id="checkbox" type="checkbox" value="${user.id}" />
                                        ${user.name}
                                    </label>
                                </div>`
    });
}
showallUsers();

createGroupModal.addEventListener('click', async (e) => {
    $('#GroupModal').modal('show');
})

// create group and update from submittion
createGroup.addEventListener('submit', async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token');
    let groupName = document.getElementById('groupName').value
    let id = document.getElementById('groupId').value
    let checkboxes = document.querySelectorAll('#checkbox');
    let selectedValues = [];
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            selectedValues.push(checkbox.value);
        }
    });
    let data = {
        name: groupName,
        nomember: selectedValues.length + 1,
        userList: selectedValues
    }
    try {
        if (!id) {
            const response = await axios.post('/user/createGroup', data, { headers: { "Authorization": token } });
            if (response.data.message == 'success') {
                await displayNotification('Group created Successfully!', 'success', divAlert);
            }
            window.location.reload();
        }
        else {
            const response = await axios.put(`/user/updateGroup/${id}`, data, { headers: { "Authorization": token } });
            if (response.data.message == 'success') {
                await displayNotification('Group created Successfully!', 'success', divAlert);
            }
            window.location.reload();
        }

    } catch (error) {
        console.log(error);
        await displayNotification("Internal Server Error!", 'danger', divAlert);

    }

})

// Save message into db 
document.getElementById('fileInput').addEventListener('change', function () {
    var fileName = this.files[0].name;
    document.getElementById('showFileName').innerHTML = fileName;
    var preview = document.getElementById('imagePreview');
    preview.style.display = 'block';

    var reader = new FileReader();
    reader.onload = function (e) {
        preview.src = e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
});
// Send messages 
massageFrom.addEventListener('submit', async (e) => {
    e.preventDefault();
    const stringObj = localStorage.getItem('groupinfo')
    const groupinfo = JSON.parse(stringObj);
    // console.log("current group id", groupinfo)
    const groupId = groupinfo.currentGroupId;
    const groupName = groupinfo.currentGroupName;
    const fileInput = document.getElementById('fileInput')
    const file = fileInput.files[0]
    let messageText = document.getElementById('messageText').value
    try {
        const token = localStorage.getItem('token');
        if (!file) {
            const response = await axios.post('/chat/sendMessage', { messageText, groupId }, { headers: { "Authorization": token } });
            if (response.data.message == 'success') {
                await displayNotification('message send Successfully!', 'success', divAlert);
                massageFrom.reset();
                document.getElementById('imagePreview').src = "";
                socket.emit('new-group-message', groupinfo)
                readChatBoxMessage(groupId, groupName);
            }
        }
        else {
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('image', file);
            formData.append('groupId', groupId)
            const response = await axios.post('/chat/sendImage', formData, { headers: { "Authorization": token } });
            if (response.data.message == 'success') {
                await displayNotification('message send Successfully!', 'success', divAlert);
                massageFrom.reset();
                socket.emit('new-group-message', groupinfo)
                readChatBoxMessage(groupId, groupName);
            }
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

// reading messages from the database 
const readChatBoxMessage = async (groupId, groupName) => {

    try {
        const response = await axios.get(`/chat/readMessages/${groupId}`)

        localStorage.setItem('lastTenMessages', JSON.stringify(response.data));

        showChatBoxMessages(groupId, groupName);
    } catch (err) {
        console.log(err);
    }
}

// showing messages in chat box 
const showChatBoxMessages = async (groupId, groupName) => {

    // showing EDIT GROUP FUNCATIONALITY
    editgroup.addEventListener('click', () => {
        const updateGroupName = document.getElementById('updateGroupName');
        const currentGroupId = document.getElementById('groupId');
        const gName = document.getElementById('groupName');

        updateGroupName.innerHTML = 'Update Group';
        currentGroupId.value = groupId;
        gName.value = groupName;
        $('#GroupModal').modal('show');

    })

    groupHeader.innerHTML = groupName;
    // Creating remove button  
    chatBox.innerHTML = ""
    const storedMessages = JSON.parse(localStorage.getItem('lastTenMessages'));
    storedMessages.forEach((message) => {

        let messageText = message.messageText;
        let currentTime = message.currentTime;
        const token = localStorage.getItem('token');
        const decodeToken = parseJwt(token)
        console.log(message)
        if (decodeToken.userId == message.UserId && message.isImage === true) {
            chatBox.innerHTML += `<div class="message sender" id="sender">
                            <div class="message-content" id="senderMsg">
                            <sup>you</sup>
                            <img style ="width: 100px; height: 100px; display: block:" src="../${message.ImageUrl}">
                            ${messageText}
                            <sub>${currentTime}</sub>
                            </div>
                        </div>`
        }
        else if (decodeToken.userId == message.UserId) {
            chatBox.innerHTML += `<div class="message sender" id="sender">
                            <div class="message-content" id="senderMsg">
                            <sup>you</sup>
                            ${messageText}
                            <sub>${currentTime}</sub>
                            </div>
                        </div>`
        }
        else if (message.isImage === true) {
            chatBox.innerHTML += `<div class="message receiver" id="receiver">
                            <div class="message-content" id="receiverMsg">
                            <sup>${message.User.name}</sup>
                             <img style ="width: 100px; height: 100px;" src="../${message.ImageUrl}">
                            ${messageText}
                            <sub>${currentTime}</sub>
                            </div>
                        </div>`
        }
        else {
            chatBox.innerHTML += `<div class="message receiver" id="receiver">
                            <div class="message-content" id="receiverMsg">
                            <sup>${message.User.name}</sup>
                            ${messageText}
                            <sub>${currentTime}</sub>
                            </div>
                        </div>`
        }


        // if (decodeToken.userId == message.UserId) {

        //     sup = document.createElement('sup');
        //     sup.textContent = 'you'
        //     sup.style.color = 'yellow'
        //     let div1 = document.createElement('div');
        //     div1.className = 'message sender';
        //     div1.id = 'sender'

        //     let div2 = document.createElement('div');
        //     div2.className = 'message-content';
        //     div2.id = 'senderMsg'
        //     div2.appendChild(sup)
        //     div2.appendChild(document.createTextNode(' ' + messageText + ' '))

        //     let sub = document.createElement('sub')
        //     sub.textContent = `${currentTime}`

        //     div2.appendChild(sub);
        //     div1.appendChild(div2)


        //     // loading.parentNode.insertBefore(div1, loading);
        //     chatBox.appendChild(div1)

        // } else {
        //     sup = document.createElement('sup');
        //     sup.textContent = message.User.name;
        //     sup.style.color = 'blue'
        //     console.log('sender')

        //     let div1 = document.createElement('div');
        //     div1.className = 'message receiver';
        //     div1.id = 'receiver'

        //     let div2 = document.createElement('div');
        //     div2.className = 'message-content';
        //     div2.id = 'receiverMsg'

        //     div2.appendChild(sup)
        //     div2.appendChild(document.createTextNode(' ' + messageText + ' '))
        //     let sub = document.createElement('sub')
        //     sub.textContent = `${currentTime}`

        //     div2.appendChild(sub);
        //     div1.appendChild(div2)
        //     chatBox.appendChild(div1)
        // }
    })
}

// setInterval(showChatBoxMessages, 1000);
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
