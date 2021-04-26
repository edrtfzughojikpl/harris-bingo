const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {
  Server
} = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 80;

const fs = require('fs');
io.on('connection', async (socket) => {
  socket.on('message', (data) => {
    if (JSON.parse(data).username) {
      fs.appendFileSync('completedBingos.txt', data + "\n");
      socket.broadcast.emit('chat message', JSON.parse(data).username);
    } else {
      data = JSON.parse(data);
      BingosDB.deleteMany({}, (error) => {
        if (error) console.log(error)
      });
      CheckedBingosDB.deleteMany({}, (error) => {
        if (error) console.log(error)
      });
      data.Bingos.forEach(bingo => BingosDB.create({
        text: bingo
      }));
      data.checkedBingos.forEach(checkedBingo => CheckedBingosDB.create({
        number: checkedBingo
      }));
    }
  });

  var BingosD = await BingosDB.find({});
  var checkedBingosD = await CheckedBingosDB.find({});
  var Bingos = [];
  var checkedBingos = [];
  BingosD.forEach(bingo => Bingos.push(bingo.text));
  checkedBingosD.forEach(checkedBingo => checkedBingos.push(checkedBingo.number));
  socket.send(JSON.stringify({
    Bingos,
    checkedBingos
  }));
});

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/gamemaster/bingo', (req, res) => {
  res.render('pages/gamemaster/bingo');
});

app.get('/gamemaster/suggestion', (req, res) => {
  res.render('pages/gamemaster/suggestion');
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const mongoose = require('mongoose');
const DB_ADMIN = "twitchDBAdmin";
const DB_PASSWORD = "zU7rIr1Tgk1n7To6";
const schemas = require('./schemas');
const uri = `mongodb+srv://${DB_ADMIN}:${DB_PASSWORD}@channeldata.1fx0c.mongodb.net/HarrisBingo?retryWrites=true&w=majority`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database connected!');
});

const BingosDB = mongoose.model('bingos', schemas.bingoSchema);
const CheckedBingosDB = mongoose.model('checkedBingos', schemas.checkedBingosSchema);