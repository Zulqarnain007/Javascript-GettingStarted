// 
// Black jack
// by ZZ

// card variables
let suites = ['Hearts', 'Clubs', 'Diamonds', 'Spades'],
  values = ['Ace', 'King', 'Queen', 'Jack',
    'Ten', 'Nine', 'Eight', 'Seven', 'Six',
    'Five', 'Four', 'Three', 'Two'
  ];
// DOM variables
let txtArea = document.getElementById('text-area'),
  btnNewGame = document.getElementById('newGame-button'),
  btnHit = document.getElementById('hit-button'),
  btnStay = document.getElementById('stay-button');

// Game variables
let gameStarted = false,
  gameOver = false,
  playerWon = false,
  dealerCards = [],
  playerCards = [],
  dealerScore = 0,
  playerScore = 0,
  deck = [];

btnHit.style.display = 'none';
btnStay.style.display = 'none';
showStatus();

btnNewGame.addEventListener('click', function() {
  gameStarted = true;
  gameOver = false;
  playerWon = false;

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  btnNewGame.style.display = 'none';
  btnStay.style.display = 'inline';
  btnHit.style.display = 'inline';
  showStatus();
});

btnHit.addEventListener('click', function() {
  playerCards.push(getNextCard());
  checkForEndOfTheGame();
  showStatus();
});

btnStay.addEventListener('click', function() {
  gameOver = true;
  checkForEndOfTheGame();
  showStatus();
});

function createDeck() {
  let deck = [];
  for (let suitidx = 0; suitidx < suites.length; suitidx++) {
    for (let valueidx = 0; valueidx < values.length; valueidx++) {
      let card = {
        suit: suites[suitidx],
        value: values[valueidx]
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    let swapidx = Math.trunc(Math.random() * deck.length);
    let temp = deck[swapidx];
    deck[swapidx] = deck[i];
    deck[i] = temp;
  }
}

function getCardString(card) {
  return card.value + ' of ' + card.suit;
}

function getNextCard() {
  return deck.shift();
}

function getCardNumericValue(card) {
  switch(card.value) {
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five':
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
}

function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  
  for(let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);

    if (card.value === 'Ace') {
      hasAce = true;
    }
  }

  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function checkForEndOfTheGame() {
  updateScores();
  
  if (gameOver) {
    // let dealer take cards
    while (dealerScore < playerScore 
          && playerScore <= 21 
          && dealerScore <= 21) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if (playerScore > 21) {
    playerWon = true;
    gameOver = true;
  }
  else if (dealerScore > 21) {
    playerWon = false;
    gameOver = true;
  } 
  else if (gameOver) {
    if (playerScore > dealerScore) {
      playerWon = true;
    }
    else {
      playerWon = false;
    }
  }
}

function showStatus() {
  if (!gameStarted) {
    txtArea.innerText = "Welcome to Blackjack !";
    return;
  }

  let dealerCardString = '';
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + '\n';
  }

  let playerCardString = '';
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + '\n';
  }

  updateScores();
  
  txtArea.innerText =
    'Dealer has:\n' +
    dealerCardString +
    '( Score : ' + dealerScore + ' )\n\n' +

    'Player has:\n' +
    playerCardString +
    '( Score : ' + playerScore + ')\n\n';

  if (gameOver) {
    if (playerWon) {
      txtArea.innerText += 'YOU WIN ...!';
    }
    else
    {
      txtArea.innerText += 'DEALER WINS ...!';
    }

    btnNewGame.style.display = 'inline';
    btnStay.style.display = 'none';
    btnHit.style.display = 'none';
  }
}