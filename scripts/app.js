//Инициализация всех обьектов

let sideNav = document.getElementById("sidenav");
let burger = document.getElementById("burger");
let secondNav = document.getElementById("secondtopnav");
let bgimg = document.getElementById("background-img");
let closeBtn = document.getElementById("closebtn");
let moveList = document.getElementById("moves-list");
let chessboards = document.getElementById("chessboards");
let chessboard = document.getElementById("chessboard");
let board = document.getElementById("board");
let maximased = document.getElementById('maximaze');




//Константы
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

//Переменные
let game = 0;
let games = 0;
let currentMove = 1;
let currentGame = 0;

//Управление боковой навигацией

function openNav() {
  sideNav.classList.add("openNav");
  closeBtn.style.left = "500px";
}

function closeNav() {
  sideNav.classList.remove("openNav");
  closeBtn.style.left = "-420px";
}
//

//Открытие и закрытие элементов на боковой навигации
let chess_list = {
  "chess-base": true,
  "chess-openings": true,
  "chess-player": true,
  'tactics': true,
  "chess-endgame": true,
};

document.addEventListener("click", (event) => {
  let targetId = event.target.id;
  let listElement = document.getElementById(targetId + "-list");
  let listArrow = document.getElementById(targetId + "-elem");

  if (targetId == 'grey-block-for-opasity'){
    minimazeboard();
  }
  if ( targetId == 'chessBtns'){
    maximazeboard();
  }


  if (listElement == null) {
    return;
  }

  if (chess_list[targetId]) {
    listElement.style.display = "block";
    chess_list[targetId] = false;
    listArrow.classList.remove("rotate-90");
  } else {
    listElement.style.display = "none";
    chess_list[targetId] = true;
    listArrow.classList.add("rotate-90");
  }


  


});

function scroll(images) {

    document.addEventListener("scroll", (event) => {
        let scrollY = window.scrollY;
        console.log(scrollY);

        let found = false;
        for (let image of images) {
        if (scrollY >= image.min && scrollY <= image.max) {
            bgimg.style.background = image.image;
            bgimg.style["background-size"] = "cover";
            bgimg.style["background-position"] = `${image.posX}% 0%`;
            found = true;
            break;
        }
        }

        if (!found) {
        bgimg.style.background = "";
        }
        if (scrollY >= 100) {
        secondNav.classList.add("stiky");
        burger.classList.add("stiky");
        burger.innerHTML = "<img src='img/icons/burgerblue.svg'>"

        } else {
            burger.classList.remove("stiky");
            secondNav.classList.remove("stiky");
            burger.style['padding-top'] = '5px'
            burger.innerHTML = "<img src='img/icons/burgerwhite.svg'>"
          }
        
        if (scrollY >= 160 ) {
            chessboard.classList.add("stiky-board");}
        else{
            chessboard.classList.remove("stiky-board");}

  });
}

function setGameInfo() {

  document.getElementById('abaut-the-game').innerHTML = games.info;
  document.getElementById("white-player").innerText = game.White;
  document.getElementById("black-player").innerText = game.Black;

  let lfm = game.list_of_moves;

  console.log(lfm.length)


  for (let moveNumber = 0; moveNumber < lfm.length; moveNumber += 2) {
    let move = `<div class="number-list-move">${moveNumber / 2 + 1}. </div>`;

    move += `<div id="listmovenumber${moveNumber}" 
                class="left-list-move" 
                onclick="setBoardFromList(${moveNumber})">
                ${lfm[moveNumber].san}
                </div>`;

    if (lfm[moveNumber + 1]) {
      move += `<div id="listmovenumber${moveNumber + 1}" 
                        class="right-list-move" 
                        onclick="setBoardFromList(${moveNumber + 1})">
                        ${lfm[moveNumber + 1].san}
                        </div>`;
    }



    moveList.innerHTML += `<div>${move}</div>`;
  }
  moveList.innerHTML += `<div class="result-wrapper" id="result"><div class="result">${game.Result}</div></div>`
}

//Шахматная доска

function initGame(gamesLoad) {
  game = gamesLoad.games[currentGame];
  console.log(game)
  games = gamesLoad;
  currentMove = 1;
  setFirstBoard();
  setGameInfo();
}
function initPos(positions, moveNum){
  game = positions;
  setFirstBoard(moveNum);
}

//Изначальная позиция, и расстановка фигур
function setFirstBoard(moveNum = 0) {
  let count_squares = 1;

  board.innerHTML = ''

  for (let i = 0; i < 8; i++) {
    let line = "";

    for (let j = 0; j < 8; j++) {
      let squareTexture = "img/board/lighter-wood.png";
      if ((i + j) % 2 == 1) {
        squareTexture = "img/board/darker-wood.png";
      }

      line += `<div 
                        class="square" 
                        id="square${count_squares}" 
                        style="background:  url(${squareTexture});
                               float: left"></div>`;
      count_squares++;
    }
    line = '<div class="line">' + line + "</div>";
    board.innerHTML += line;
  }
  setBoard(moveNum);
}


//Поставить произвольную позицию
function setBoard(numberOfmove = currentMove) {
  currentMove = numberOfmove;
  console.log(game)

  fen = game.list_of_moves[numberOfmove].fen
    .replace(/8/g, "11111111")
    .replace(/7/g, "1111111")
    .replace(/6/g, "111111")
    .replace(/5/g, "11111")
    .replace(/4/g, "1111")
    .replace(/3/g, "111")
    .replace(/2/g, "11")
    .replace(/\//g, "");

  let fenPieceToImg = {
    p: "bP.svg",
    n: "bN.svg",
    b: "bB.svg",
    k: "bK.svg",
    r: "bR.svg",
    q: "bQ.svg",
    P: "wP.svg",
    N: "wN.svg",
    B: "wB.svg",
    K: "wK.svg",
    R: "wR.svg",
    Q: "wQ.svg",
  };

  for (let i = 0; i < 64; i++) {
    if (fen[i] != "1") {
      let img = `<img src='img/chesspieces/fresca/${fenPieceToImg[fen[i]]}'>`;
      document.getElementById(`square${i + 1}`).innerHTML = img;
    } else {
      document.getElementById(`square${i + 1}`).innerHTML = "";
    }
  }
}

//Шахматный ход

function setBoardDiagram(number){
  console.log(game.list_of_moves[number].fen)
  // document.getElementById('name_of_players').innerText = game.list_of_moves[number].info
  setBoard(number)
  maximazeboard()
}

function setBoardFromList(number) {
  document.getElementById(`listmovenumber${number}`).style["background-color"] =
    "red";
  document.getElementById(`listmovenumber${currentMove}`).style[
    "background-color"
  ] = "";

  console.log(currentMove);
  currentMove = number;
  console.log(currentMove);
  setBoard(number);
}

function move() {
  if (currentMove == game.list_of_moves.length - 1) {
    return;
  }
  currentMove += 1;
  setBoard(currentMove);

  document.getElementById(`listmovenumber${currentMove}`).style[
    "background-color"
  ] = "red";
  document.getElementById(`listmovenumber${currentMove - 1}`).style[
    "background-color"
  ] = "";
}

function moveback() {
  if (currentMove > 1) {
    currentMove -= 1;
    let listOfmoves = document.getElementById(`listmovenumber${currentMove + 1}`)
    
    if (listOfmoves == true){
      
      document.getElementById(`listmovenumber${currentMove + 1}`).style["background-color"] = "";
      document.getElementById(`listmovenumber${currentMove}`).style[
        "background-color"
      ] = "red";
    }

    setBoard(currentMove);
  } else if (currentMove == 1) {
    currentMove -= 1;
    document.getElementById(`listmovenumber${currentMove + 1}`).style[
      "background-color"
    ] = "";
    setBoard(currentMove);
  }
}

function maximazeboard() {
    document.querySelector("body").style.overflow = "hidden";
    chessboards.classList.add("maxsimize-board");
    document.getElementById('grey-block-for-opasity').style.display = 'block';
    maximased.style.display = 'none'
    document.getElementById("close-btn-board").style.display = 'block'
    
}

function minimazeboard(){
    document.querySelector("body").style.overflowY = "auto";
    chessboards.classList.remove("maxsimize-board");
    document.getElementById('grey-block-for-opasity').style.display = 'none';
    maximased.style.display = 'inline-block';
    document.getElementById("close-btn-board").style.display = 'none'


}

function gameBack() {
    if (currentGame == 0){
      return
    }

    currentGame -= 1;
    game = games.games[currentGame];
    board.innerHTML = "";
    moveList.innerHTML =
        '<div class="list-move-header"><div class="number-list-move">№</div><div class="left-list-move">white</div><div class="rigth-list-move">black</div></div>';
    currentMove = 0;
    setFirstBoard();
    setGameInfo();
}
function nextGame() {
  if (currentGame == games.games.length - 1){
    return
  }
  document.getElementById(`listmovenumber${currentMove}`).style[
    "background-color"
  ] = "";

  currentGame += 1;
  game = games.games[currentGame];
  board.innerHTML = "";
  moveList.innerHTML =
    '<div class="list-move-header"><div class="number-list-move">№</div><div class="left-list-move">white</div><div class="rigth-list-move">black</div></div>';
  currentMove = 0;
  setFirstBoard();
  setGameInfo();
}

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowRight") {
    move(game);
  } else if (event.key == "ArrowLeft") {
    moveback(game);
  } else if (event.key == "ArrowDown") {
    setBoardFromList(game.list_of_moves.length - 1);
  } else if (event.key == "ArrowUp") {
    setBoardFromList(0);
  } else if (event.key == "Escape") {
    if (maximased) {
        minimazeboard();
    }
  }
});
