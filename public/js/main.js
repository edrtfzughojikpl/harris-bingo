var decodeHtmlEntity = function (x) {
    return x.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
    });
};

// bingos = JSON.parse(decodeHtmlEntity(bingos));

const boxes = document.querySelectorAll('.bingo-item');

var historyItems = [];
var historyId = [];
var bingos = [];
var bingoHash = [];
let easter = false;

const getFontSize = (textLength) => {
    const baseSize = 22;
    if (textLength >= baseSize) {
        textLength = baseSize - 2;
    }
    const fontSize = baseSize - textLength / 1.9;
    return `${fontSize}px`;
}

function undoLast() {
    if (historyItems.length < 1) return;
    historyItems[historyItems.length - 1].classList.remove('checked');
    historyItems.pop();
    historyId.pop();
    setCookie("history", historyId);
}

function reset() {
    if (historyItems.length < 1) return;
    historyItems.forEach(e => e.classList.remove('checked'));
    historyItems = [];
    historyId = [];
    setCookie("history", historyId);
}

function getNew() {
    setCookie("history", []);
    setCookie("bingoHash", []);
    reset();
    bingoHash = [];
    makeBingo();
}

function getRandomBingo() {
    const roundNumber = Math.floor(Math.random() * (bingosCopy.length - 1) + 1);
    var bingoItem = bingosCopy[roundNumber - 1];
    bingoHash.push(roundNumber);
    bingosCopy.splice(roundNumber - 1, 1);
    return bingoItem;
}

function setCookie(cname, cvalue, exdays = 365) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getElementIndex(node) {
    var index = 0;
    while ((node = node.previousElementSibling)) {
        index++;
    }
    return index;
}

var empty = true;
var bingosCopy;

function makeBingo() {
    bingoHash = (getCookie("bingoHash") != "") ? getCookie("bingoHash").split(",") : [];
    bingoHash.forEach((hash, index) => {
        bingoHash[index] = parseInt(hash);
    });
    if (bingoHash[0] == 0) bingoHash = [];
    historyId = (getCookie("history") != "") ? getCookie("history").split(",") : [];
    historyId.forEach((number, index) => {
        historyId[index] = parseInt(number);
        boxes[number].classList.add('checked');
        historyItems.push(boxes[number]);
    });
    if (bingoHash == 0) {
        empty = true;
    } else {
        empty = false;
    }
    bingosCopy = [...bingos];
    boxes.forEach((box, index) => {
        box.textContent = (empty) ? getRandomBingo().replace(/(&#34;)/gm, "").replace("[", "").replace("]", "") : bingosCopy[bingoHash[index] - 1].replace(/(&#34;)/gm, "").replace("[", "").replace("]", "");
        if (!empty) bingosCopy.splice(bingoHash[index] - 1, 1);
        box.style.fontSize = getFontSize(box.textContent.length);
    });
    setCookie("bingoHash", bingoHash);
}

boxes.forEach(box => {
    box.addEventListener('click', (e) => {
        if (e.target.classList.contains('checked')) {
            e.target.classList.remove('checked');
            let elementToRemove = historyId.indexOf(getElementIndex(e.target));
            historyId.splice(elementToRemove,1)
        }
        else {
            e.target.classList.add('checked');
            historyItems.push(e.target);
            historyId.push(getElementIndex(e.target));
        }
        setCookie("history", historyId);
    });
});

socket.on('message', (data) => {
    var {
      Bingos,
      checkedBingos
    } = JSON.parse(data);
    bingos = [];
    for (var i = 0; i < checkedBingos.length; i++){
        bingos.push(Bingos[checkedBingos[i]]);
    }
    makeBingo();
});

function submit() {
    var username = prompt("Please enter your name", "");
    if(username == "") return;
    socket.send(JSON.stringify({
        username,
        historyId,
        bingoHash
    }))
}
function changeFont(){
    let htmlBody = document.getElementById("content");
    if(easter) {
        htmlBody.style.fontFamily= "'Ubuntu', sans-serif";
        easter = false;
    }
    else {
        htmlBody.style.fontFamily="Comic Sans MS";
        easter = true;
    }
}

function makeNot(username) {
    const div = document.createElement("div");
    const text = document.createElement("div");
    text.className = "notify__text";
    var strong = document.createElement("strong");
    var em = document.createElement('em')
    em.textContent = username
    strong.appendChild(em)
    text.appendChild(strong);
    var span = document.createElement('span');
    span.textContent = "just completed a Bingo!";
    span.style.marginLeft = "5px";
    text.appendChild(span);
    div.className = "notify notify--type-1 notify--success";
    div.appendChild(text);
    return div;
}

const not_cont = document.querySelector('.notifications-container');
socket.on('chat message', function (msg) {
    var not = makeNot(msg)
    not_cont.append(not);
    setTimeout(() => {
        not.remove();
    }, 5 * 1000);
    /*
    <div class="notify notify--type-1 notify--success">
        <div class="notify-content">
            <!-- <div class="notify__title">New Bingo Filled</div> -->
            <div class="notify__text"><strong><em>Jo</em></strong><span style="margin-left: 5px;">just completed a Bingo!</span></div>
        </div>
    </div>
    */
});