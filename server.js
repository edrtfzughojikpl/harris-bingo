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

app.get('/lyrii/bingo', (req, res) => {
  res.render('pages/lyrii/bingo');
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
  // var data = {
  //   "Bingos": ["Harris gibt eine Information in den Funk", "Beschwerde über PD-04", "DE- ESKALATION", "Mehr als 10 Streifen unterwegs", "Harris wird auf seinen Hut angesprochen", "Marshals verhalten sich fragwürdig", "Harris wird ignoriert", "Jemand fragt nach PD-Merch (Polizeiautos, Kluis, etc.)", "Reznikowa im Dienst", "Harris wechselt die Uniform", "Harris drückt einen Anrufer weg", "Harris auf Streife", "O'Hara erzählt von seiner Frau", "Denton ist nicht erreichbar", "Funk stört", "Jemand wird befördert", "Rekrut wird eingestellt", "Schlange vorm Büro (mind. 3 Personen)", "Dauerfunk", "N.O.O.S.E. (Blackout)", "10-43", "10-99", "Keith", "Hall", "Smith", "HelloWorld"],
  //   "checkedBingos": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25]
  // };

  // data.Bingos.forEach(bingo => {
  //   BingosDB.create({text: bingo});
  // })

  // data.checkedBingos.forEach(bingo => {
  //   CheckedBingosDB.create({number: bingo});
  // })
});

const BingosDB = mongoose.model('bingos', schemas.bingoSchema);
const CheckedBingosDB = mongoose.model('checkedBingos', schemas.checkedBingosSchema);