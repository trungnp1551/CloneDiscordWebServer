const express = require('express')
const app = express();
const http = require('http')

require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan');
const SocketServer = require('./socketServer')

const server = http.createServer(app)
var io = require('socket.io')(server);

const PORT = process.env.PORT || 5000
const URI = process.env.DB_CONNECTION

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors());
app.use(morgan('dev'));


const userRouter = require('./routers/user')
const guildRouter = require('./routers/guild')
const imageRouter = require('./routers/image')
const channelRouter = require('./routers/channel')

app.use('/user', userRouter)
app.use('/guild', guildRouter)
app.use('/image', imageRouter)
app.use('/channel', channelRouter)

mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to DB");

  })
  .catch((err) => {
    console.log("err", err);
  });

io.on('connection', socket => {
  console.log(socket.id + ' connected')
  SocketServer(socket, io)
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
