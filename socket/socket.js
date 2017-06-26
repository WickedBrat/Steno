module.exports = function(io, room) {
  var chatrooms = io.of('/roomlist').on('connection', function(socket){
    console.log('Connection Establish on the server!');
    socket.emit('roomupdate', JSON.stringify(room)); // sends it back to the user that created it in the first place.

    // Receive the new room event.
    socket.on('newroom', function(data){
      room.push(data); // append the data into the array.
      socket.broadcast.emit('roomupdate', JSON.stringify(room)); // doesn't broadcast to the person that created the room.
      socket.emit('roomupdate', JSON.stringify(room)); // sends it back to the user that created it in the first place.
    })
  });

  var messages = io.of('/messages').on('connection', function(socket){
    console.log("Connected to chatroom.");

    socket.on('joinroom', function(data){
      socket.username = data.user;
      socket.userPic = data.userPic;
      socket.join(data.room);
    })
  })
}

