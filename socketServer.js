var users = [];
const User = require("./models/user");
const messageService = require("./service/message");
const userService = require("./service/user");

const SocketServer = (socket, io) => {
  socket.on("signin", async (data) => {
    const id = data;
    const user = await users.find((user) => user.userId == id);
    if (!user) {
      users.push({
        userId: id,
        socketId: socket.id,
      });
      console.log("Users: ");
      console.log(users);
    }
    await userService.setStatus(user.userId, "Online");
    const userData = await User.findById(id)
      .populate("guilds")
      .populate("channels");
    userData.channels.forEach((channel) => {
      socket.join(channel._id.toString());
    });
    userData.guilds.forEach((guild) => {
      guild.channels.forEach((channel) => {
        socket.join(channel._id.toString());
      });
    });
  });

  socket.on("message", async (data) => {
    console.log(data);
    const { timestamp, content, isImage, channel_id } = data;
    //author, timestamp, content, isImage, channel_id
    const sender = await users.find((user) => user.socketId == socket.id);
    const user = await User.findById(sender.userId);
    const mess = await messageService.addMessage(
      user._id,
      timestamp,
      content,
      isImage,
      channel_id
    );
    console.log(mess);
    io.to(`${channel_id}`).emit("message", { mess });
  });

    socket.on('message', async (data) => {
        console.log(data)
        const {timestamp, content, isImage, channel_id} = data
        //author, timestamp, content, isImage, channel_id
        const sender = await users.find(user => user.socketId == socket.id)
        const user = await User.findById(sender.userId).populate('')
        const avtAuthor = await userService.getAvatar(user._id)
        const mess = await messageService.addMessage(user._id, timestamp, content, isImage, channel_id)
        var data = {
            _id: mess._id,
            authorId: user._id,
            authorName: user.username,
            authorFakeId: user.id_fake,
            avatarUrlAuthor: avtAuthor.imageUrl,
            timestamp: mess.timestamp,
            content: mess.content,
            isImage: mess.isImage
        }
        console.log(data)
        io.to(`${channel_id}`).emit('message',({data}));
    })

  socket.on("logout", async () => {
    const user = await users.find((user) => user.socketId == socket.id);
    if (!user) {
      return;
    }
    await userService.setStatus(user.userId, "Invisible");
    users.splice(users.indexOf(client), 1);
    console.log(users);
    console.log("logout socket");
  });
};

module.exports = SocketServer;
