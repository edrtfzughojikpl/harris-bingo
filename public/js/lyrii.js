var decodeHtmlEntity = function (x) {
  return x.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec);
  });
};

const BingoContainer = document.getElementById("bingos");
const clickedItem = document.getElementById("clicked");
var inputs;
var editBtns;
var delteBtns;
var checkedItems = 0;

function updateTable() {
  bingos.forEach(bingo => {
    createTableRow(bingo);
  });
  inputs = document.querySelectorAll("input[type='checkbox']");
  editBtns = document.querySelectorAll(".edit");
  delteBtns = document.querySelectorAll(".delete");

  inputs.forEach(input => {
    input.addEventListener('click', e => {
      if (e.target.checked) {
        checkedItems++;
      } else {
        checkedItems--;
      }
      clickedItem.textContent = `${(checkedItems<10)?"0"+checkedItems:checkedItems}/25`;
    });
  });

  editBtns.forEach(editBtn => {
    editBtn.addEventListener('click', e => {
      var text = prompt("Enter a Bingo Text", e.target.previousElementSibling.textContent);
      console.log(text);
      if (text == "" || text == null) return;
      e.target.previousElementSibling.textContent = text;
    });
  });

  delteBtns.forEach(delteBtn => {
    delteBtn.addEventListener('click', e => {
      if (!confirm('Are you sure you want to delete this?')) return;
      if (e.target.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild.checked) {
        checkedItems--;
        clickedItem.textContent = `${(checkedItems<10)?"0"+checkedItems:checkedItems}/25`;
      }
      e.target.parentNode.remove();
    });
  });
}

socket.on('message', (data) => {
  var {
    Bingos,
    checkedBingos
  } = JSON.parse(data);
  bingos = Bingos;

  updateTable();
  inputs = document.querySelectorAll("input[type='checkbox']");
  for (var i = 0; i < checkedBingos.length; i++){
    inputs[checkedBingos[i]].checked = true;
    checkedItems++;
  }
  clickedItem.textContent = `${(checkedItems<10)?"0"+checkedItems:checkedItems}/25`;
});


function newBingo() {
  var text = prompt("Please enter a Bingo text", "");
  if (text == "") return;
  createTableRow(text);
}

function save() {
  var BingoItmes = document.querySelectorAll('.text');
  var Bingos = [];
  for (var i = 0; i < BingoItmes.length; i++)
    Bingos.push(BingoItmes[i].textContent);

  inputs = document.querySelectorAll("input[type='checkbox']");
  var checkedBingos = [];
  for (var i = 0; i < inputs.length; i++)
    if (inputs[i].checked)
      checkedBingos.push(i);

  if (checkedBingos.length != 25) {
    alert("Not 25 Bingos selected!!!");
    return;
  }

  socket.send(JSON.stringify({
    Bingos,
    checkedBingos
  }))
}



function createTableRow(bingo) {
  var tr = document.createElement("tr");
  var check = document.createElement("td");
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  check.appendChild(checkbox);
  var text = document.createElement("td");
  text.className = "text";
  text.textContent = bingo;
  var edit = document.createElement("td");
  edit.className = "edit";
  edit.textContent = "edit";
  var deleteTd = document.createElement("td");
  deleteTd.className = "delete";
  deleteTd.textContent = "delete";
  tr.appendChild(check);
  tr.appendChild(text);
  tr.appendChild(edit);
  tr.appendChild(deleteTd);
  BingoContainer.append(tr);
}