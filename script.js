startButton = document.querySelector("#startButton");
// document.body.appendChild(startButton);

let winCondition = false;

function createDeck() {
  const blackjackDeck = [
    "♠2",
    "♠3",
    "♠4",
    "♠5",
    "♠6",
    "♠7",
    "♠8",
    "♠9",
    "♠10",
    "♠J",
    "♠Q",
    "♠K",
    "♠A",
    "♥2",
    "♥3",
    "♥4",
    "♥5",
    "♥6",
    "♥7",
    "♥8",
    "♥9",
    "♥10",
    "♥J",
    "♥Q",
    "♥K",
    "♥A",
    "♣2",
    "♣3",
    "♣4",
    "♣5",
    "♣6",
    "♣7",
    "♣8",
    "♣9",
    "♣10",
    "♣J",
    "♣Q",
    "♣K",
    "♣A",
    "♦2",
    "♦3",
    "♦4",
    "♦5",
    "♦6",
    "♦7",
    "♦8",
    "♦9",
    "♦10",
    "♦J",
    "♦Q",
    "♦K",
    "♦A",
  ];
  return blackjackDeck;
}

//Fisher-Yates shuffle
function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function findSum(array) {
  let hand_sum = 0;
  let ace_count = 0;
  for (let i = 0; i < array.length; i++) {
    const current_card = array[i];
    const card_number =
      current_card.length > 2 ? current_card.substring(1) : current_card[1]; //checks if card is 10

    if (card_number === "A") {
      hand_sum += 11;
      ace_count += 1;
    } else if (["K", "Q", "J"].includes(card_number)) {
      hand_sum += 10;
    } else if (["10"].includes(current_card)) {
      hand_sum += 10;
    } else {
      hand_sum += parseInt(card_number, 10);
    }
    if (hand_sum > 21 && ace_count > 0) {
      hand_sum -= 10;
      ace_count -= 1;
    }
  }
  return hand_sum;
}

function updateCards(handContent, cardHolder) {
  let previousCards;

  if (!handContent.includes(" ??") && cardHolder === dealerCardHolder) {
    cardHolder.innerHTML = "";
    previousCards = 0;
  } else {
    previousCards = cardHolder.children.length;
  }

  for (let cards = previousCards; cards < handContent.length; cards++) {
    const current_card = handContent[cards];
    const playerCard = document.createElement("div");
    if (current_card[0] === "♥" || current_card[0] === "♦") {
      playerCard.classList.add("card", "orange");
    } else if (current_card === " ??") {
      playerCard.classList.add("card", "dealer");
    } else {
      playerCard.className = "card";
    }
    playerCard.textContent = current_card;
    cardHolder.appendChild(playerCard);
  }
}

function playBlackjack(firstAttempt) {
  if (firstAttempt === true) {
    document.body.removeChild(startButton);
  }
  winCondition = false;

  const blackjackDeck = createDeck();

  shuffle(blackjackDeck);

  const playerHandContent = [blackjackDeck.pop(), blackjackDeck.pop()];
  const dealerHandContent = [blackjackDeck.pop(), blackjackDeck.pop()];

  const modifiedDealerHandContent = [dealerHandContent[0], " ??"];

  playerCardHolder = document.createElement("div");
  dealerCardHolder = document.createElement("div");

  const hitButton = document.createElement("button");
  const standButton = document.createElement("button");

  const currentCards = document.createElement("section");
  const playerHand = document.createElement("div");
  const dealerHand = document.createElement("div");

  playerHand.className = "log";
  dealerHand.className = "log";
  playerCardHolder.className = "cardholder";
  dealerCardHolder.className = "cardholder";

  hitButton.textContent = "Hit";
  standButton.textContent = "Stand";

  hitButton.addEventListener("click", function () {
    if (!winCondition) {
      console.log(`Clicking hit, winCon is ${winCondition}`);
      hit(playerHandContent, blackjackDeck, playerHand);
    }
  });
  standButton.addEventListener("click", function () {
    if (!winCondition) {
      console.log(`Clicking  stand, winCon is ${winCondition}`);
      stand();
      dealerRound(
        dealerHandContent,
        playerHandContent,
        blackjackDeck,
        dealerHand
      );
      if (findSum(playerHandContent) > findSum(dealerHandContent)) {
        winCondition = true;
        const dealerWinMessage = document.createElement("div");
        dealerWinMessage.className = "log";
        dealerWinMessage.textContent = "You win! (Higher Hand Count)";
        playerCardHolder.style.backgroundColor = "green";
        dealerWinMessage.style.color = "green";
        document.body.appendChild(dealerWinMessage);
        endGame();
      }
      if (findSum(playerHandContent) === findSum(dealerHandContent)) {
        winCondition = true;
        const dealerWinMessage = document.createElement("div");
        dealerWinMessage.className = "log";
        dealerWinMessage.textContent = "Tie (Equal Hand Count)";
        playerCardHolder.style.backgroundColor = "green";
        dealerCardHolder.style.backgroundColor = "green";
        dealerWinMessage.style.color = "green";
        document.body.appendChild(dealerWinMessage);
        endGame();
      }
    }
  });

  updateCards(playerHandContent, playerCardHolder);
  updateCards(modifiedDealerHandContent, dealerCardHolder);
  document.body.appendChild(playerCardHolder);
  document.body.appendChild(dealerCardHolder);

  document.body.appendChild(hitButton);
  document.body.appendChild(standButton);

  playerHand.textContent = `Your Hand : ${playerHandContent}. Sum: ${findSum(
    playerHandContent
  )}`;
  dealerHand.textContent = `Dealer Hand : ${modifiedDealerHandContent}. Sum: ${dealerHandContent[0]}+??`;

  playerHand.style.color = "#FF8040";
  dealerHand.style.color = "#FF8040";

  currentCards.appendChild(playerHand);
  currentCards.appendChild(dealerHand);
  document.body.appendChild(currentCards);
}

function dealerRound(
  dealerHandContent,
  playerHandContent,
  blackjackDeck,
  dealerHand
) {
  updateCards(dealerHandContent, dealerCardHolder);
  if (findSum(dealerHandContent) > findSum(playerHandContent)) {
    winCondition = true;
    const dealerWinMessage = document.createElement("div");
    dealerWinMessage.className = "log";
    dealerWinMessage.textContent = "Dealer Wins (Higher Hand Count)";
    dealerCardHolder.style.backgroundColor = "green";
    dealerWinMessage.style.color = "red";
    document.body.appendChild(dealerWinMessage);
    dealerHand.textContent = `Dealer Hand : ${dealerHandContent}. Sum: ${findSum(
      dealerHandContent
    )}`;
    endGame();
  } else {
    for (
      let i = findSum(dealerHandContent);
      i < 18;
      i = findSum(dealerHandContent)
    ) {
      dealerHandContent.push(blackjackDeck.pop());
      const dealerHitMessage = document.createElement("div");
      dealerHitMessage.className = "log";
      dealerHitMessage.textContent = "Dealer Hits";
      dealerHitMessage.style.color = "orange";
      document.body.appendChild(dealerHitMessage);
      updateCards(dealerHandContent, dealerCardHolder);
      if (findSum(dealerHandContent) > 21) {
        winCondition = true;
        const dealerWinMessage = document.createElement("div");
        dealerWinMessage.className = "log";
        dealerWinMessage.textContent = "Dealer Busts! (You Win)";
        playerCardHolder.style.backgroundColor = "green";
        dealerWinMessage.style.color = "green";
        document.body.appendChild(dealerWinMessage);
        endGame();
      } else if (findSum(dealerHandContent) > findSum(playerHandContent)) {
        winCondition = true;
        const dealerWinMessage = document.createElement("div");
        dealerHitMessage.className = "log";
        dealerWinMessage.textContent = "Dealer Wins (Higher Hand Count)";
        dealerCardHolder.style.backgroundColor = "green";
        dealerWinMessage.style.color = "red";
        document.body.appendChild(dealerWinMessage);
        console.log(winCondition);
        dealerHand.textContent = `Dealer Hand : ${dealerHandContent}. Sum: ${findSum(
          dealerHandContent
        )}`;
        endGame();
        break;
      }
    }
    console.log(winCondition);
    dealerHand.textContent = `Dealer Hand : ${dealerHandContent}. Sum: ${findSum(
      dealerHandContent
    )}`;
  }
}

function hit(playerHandContent, blackjackDeck, playerHand) {
  playerHandContent.push(blackjackDeck.pop());
  updateCards(playerHandContent, playerCardHolder);

  if (findSum(playerHandContent) > 21) {
    winCondition = true;
    const loseMessage = document.createElement("div");
    loseMessage.className = "log";
    loseMessage.textContent = "You bust!";
    loseMessage.style.color = "red";
    dealerCardHolder.style.backgroundColor = "green";
    document.body.appendChild(loseMessage);
    endGame();
  } else {
    const hitMessage = document.createElement("div");
    hitMessage.className = "log";
    hitMessage.textContent = "You hit";
    hitMessage.style.color = "green";
    document.body.appendChild(hitMessage);
  }
  console.log(winCondition);
  playerHand.textContent = `Your Hand : ${playerHandContent}. Sum: ${findSum(
    playerHandContent
  )}`;
}

function stand() {
  const standMessage = document.createElement("div");
  standMessage.className = "log";
  standMessage.textContent = "You stand";
  standMessage.style.color = "green";
  document.body.appendChild(standMessage);
}

function endGame() {
  const playAgainButton = document.createElement("button");
  playAgainButton.id = "playAgain";
  playAgainButton.textContent = "Play Again";

  playAgainButton.addEventListener("click", function () {
    document.body.innerHTML = "";
    const blackjackH1 = document.createElement("h1");
    blackjackH1.textContent = "Blackjack Project";
    document.body.appendChild(blackjackH1);

    const infoBox = document.createElement("div");
    infoBox.className = "infobox";
    const infoButton = document.createElement("a");
    infoButton.className = "info";
    infoButton.href = "info.html";
    infoButton.textContent = "Info";
    const moreProjectsButton = document.createElement("a");
    moreProjectsButton.className = "info";
    moreProjectsButton.href = "https://github.com/Temponius";
    moreProjectsButton.textContent = "More Projects";

    infoBox.appendChild(infoButton);
    infoBox.appendChild(moreProjectsButton);
    document.body.appendChild(infoBox);

    const copyrightFooter = document.createElement("footer");
    copyrightFooter.className = "copyright";
    copyrightFooterPar = document.createElement("p");
    copyrightFooterPar.id = "copyrightText";
    copyrightFooterPar.textContent = "Copyright © Brandon C";

    copyrightFooter.appendChild(copyrightFooterPar);
    document.body.appendChild(copyrightFooter);

    playBlackjack();
  });

  document.body.appendChild(playAgainButton);
}
