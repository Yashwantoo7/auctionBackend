const users = [];
const rooms = {};

const checkRoom = (id,room) =>{
    const present = users.find(user=>user.room===room);
    if(!present){
        rooms[room]=id;
    }
    return present;
}

const addUser = ({id,name,room})=>{
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find(user=>user.room===room && user.name===name);

    if(!name || !room)return {error:'Username and room are required.'};
    if(existingUser)return ({error:'Username is taken.'});

    const user = {id,name,room};
    users.push(user);
    return {user};
}

// const leaveRoom = (id) =>{
//     const index = users.findIndex(user=>user.id===id);
//     let admin = rooms[users[index].room]
//     let room = users[index].room;
//     if(admin===id){
//         var temp = [];
//         for(let i=0;i<users.length;i++){
//             if(users[i].room!==room){
//                 temp.push(users[i]);
//             }
//         }
//         users = temp;
//         return;
//     }
//     else{
//         return users.splice(index,1)[0];
//     }
// }

const removeUser = (id) => {

    const index = users.findIndex(user=>user.id===id);
    if(index!==-1)return users.splice(index,1)[0];
}

const getUser = (id) => users.find(user=>user.id===id);

const getUsersInRoom = (room) => users.filter(user => user.room===room);

module.exports = { checkRoom, addUser, removeUser, getUser, getUsersInRoom,users};
