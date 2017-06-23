module.exports = function(io, room) {
	var chatrooms = io.of('/roomlist').on('Connection', function(socket){
		console.log('Connection Established on the server');

		socket.on('newroom', function(data){
			room.push(data);
			socket.broadcast.emit('roomupdate',JSON.stringify(room));
			socket.emit('roomupdate', JSON.stringify(room));
		})
	})
}