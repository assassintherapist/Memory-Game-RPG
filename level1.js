const cards = document.querySelectorAll('.memory-card');

let timer;
const ele = document.getElementById('timer');
const playerHealth = document.getElementById('playerHealth');
const enemyHealth = document.getElementById('enemyHealth');

let enemyLife = 3;
let playerLife = 3;
let sec = 20;

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let winCount = 0;

function flipCard(){
  if(lockBoard) return;
  if(this === firstCard) return;
  this.classList.toggle('flip');

  if(!hasFlippedCard){
    // first click
    hasFlippedCard = true;
    firstCard = this;
    return;
  } 
  //second click
  secondCard = this;
  //check if match
  checkForMatch()
}

function checkForMatch(){
  if(firstCard.dataset.framework === secondCard.dataset.framework){
    disableCards()
    winCount++;
  } else{
    unflipCards();
  }
  // Replay if all is a match
  replayMatch()
}

function disableCards(){
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  document.getElementById('match').play()
  resetBoard()
}

function unflipCards(){
  lockBoard = true;

  setTimeout(()=>{
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    document.getElementById('notMatch').play()
    lockBoard = false;
    resetBoard()
  },1000)
}

function resetBoard(){
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle(){
  cards.forEach(card => {
    let random = Math.floor(Math.random() * 8);
    card.style.order = random
  })
})();

function replayMatch(){
  setTimeout(()=>{
    if(winCount === 4){
      cards.forEach(card => {
        let random = Math.floor(Math.random() * 8);
        card.style.order = random;
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
        winCount = 0;
        document.querySelector('.slash').style.display = 'inline';
        document.querySelector('.enemy-hit').style.display = 'inline';
        document.getElementById('swordSlash').play()
      });
      setTimeout(()=>{
        document.querySelector('.slash').style.display = 'none';
        document.querySelector('.enemy-hit').style.display = 'none';
      },500)
      enemyLife--
      enemyHealth.innerHTML ="x "+ enemyLife;
      setTimeout(()=>{
        if(enemyLife === 0){
          window.location.href = "loading-screen.html"
        }
      },500)
    }
  },500)
}

//Timer
(function(){
  timer = setInterval(()=>{
    ele.innerHTML = '00:'+ sec;
    sec--
    if(sec === -1){
      playerLife--
      playerHealth.innerHTML ="x "+ playerLife;
      document.querySelector('body').style.background = "red";
      document.getElementById('hurt').play();
      document.querySelector('.player-hit').style.display = 'inline';
      setTimeout(()=>{
        document.querySelector('body').style.background = "";
        document.querySelector('.player-hit').style.display = 'none';
      },500)
      sec = 20;
      setTimeout(()=>{
        if(playerLife === 0){
          window.location.href = "game-over.html"
        }
      },500)
    }
  },1000)
})();
//End of Timer

cards.forEach(card => card.addEventListener('click', flipCard));
