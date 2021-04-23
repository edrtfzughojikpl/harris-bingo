const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 80;

const Bingos = [
  'Harris gibt eine Information in den Funk',
  'Beschwerde über PD-04',
  'DE- ESKALATION',
  'Mehr als 10 Streifen unterwegs',
  'Harris wird auf seinen Hut angesprochen',
  'Marshals verhalten sich fragwürdig',
  'Harris wird ignoriert',
  'Jemand fragt nach PD-Merch (Polizeiautos, Kluis, etc.)',
  'Reznikowa im Dienst',
  'Harris wechselt die Uniform',
  'Harris drückt einen Anrufer weg',
  'Harris auf Streife',
  'O\'Hara erzählt von seiner Frau',
  'Denton ist nicht erreichbar',
  'Funk stört',
  'Jemand wird befördert',
  'Rekrut wird eingestellt',
  'Schlange vorm Büro (mind. 3 Personen)',
  'Dauerfunk',
  'N.O.O.S.E. (Blackout)',
  '10-43',
  '10-99',
  'Keith',
  'Hall',
  'Smith'
];
const fs = require('fs');
io.on('connection', (socket) => {
  socket.on('message', (data) => {
    fs.appendFileSync('completedBingos.txt', data+"\n");
    socket.broadcast.emit('chat message', JSON.parse(data).username);
  })
});

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index', {
    Bingos: JSON.stringify(Bingos)
  });
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// let data = '01020304050607080910111213141516171819202122232425';
// let buff = new Buffer(data);
// let base64data = buff.toString('base64');
// console.log('"' + data + '" converted to Base64 is "' + base64data + '"');

//  data = base64data;
//  buff = new Buffer(data, 'base64');
// let text = buff.toString('ascii');
// console.log('"' + data + '" converted from Base64 to ASCII is "' + text + '"');