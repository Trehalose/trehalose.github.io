'use strict';

const MAX_COUNT = 5;
const askPlayerCount = (error = '') => {
  const errorMsg = error ? `${error}\n\n` : '';
  const playerCountStr = prompt(`${errorMsg}How many additional players would you like to join you?\n- 1 is the minimum. (default)\n- ${MAX_COUNT} is the maximum.`);
  const playerCountNum = Number(playerCountStr || 1);

  /*
  	Checks if out of allowed opponent range or if other invalid inputs
  	Returns a number
  */
  if (typeof playerCountNum === 'number' && playerCountNum >= 1 && playerCountNum <= MAX_COUNT) {
    return playerCountNum;
  } else {
    return askPlayerCount(`Nice try buddy, we need a number between 1-${MAX_COUNT} to continue. Try again!`);
  }
};

const loadDeck = () => {
  return [].concat(addSuitCards('heart'), addSuitCards('spade'), addSuitCards('diamond'), addSuitCards('club'));
};

/* Card format will look like so:
	{
		suit: 'heart',
		rank: 2	// 2-14, with 11-14 as the face cards
		prettyName: '2 of Hearts',
	}
*/
const addSuitCards = suit => {
  if (!suit) return;
  const suitmates = [];
  for (let i = 2; i <= 14; i++) {
    const cardDeets = {
      suit,
      rank: i
    };
    let prettyRankName;
    switch (i) {
      case 11:
        prettyRankName = 'Jack';
        break;
      case 12:
        prettyRankName = 'Queen';
        break;
      case 13:
        prettyRankName = 'King';
        break;
      case 14:
        prettyRankName = 'Ace';
        break;
      default:
        prettyRankName = i;
        break;
    }
    cardDeets.prettyName = `${prettyRankName} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}s`;
    suitmates.push(cardDeets);
  }
  return suitmates;
};

const deck = loadDeck();
const MAX_CARDS_IN_HAND = 5;
const dealHand = () => {
  const hand = [];
  // Get 5 random cards from core deck to pass to a player's hand
  for (let cardCount = 0; cardCount < MAX_CARDS_IN_HAND; cardCount++) {
    const cardIndex = Math.floor(Math.random() * deck.length);
    const selectedCard = deck.splice(cardIndex, 1)[0];
    hand.push(selectedCard);
  }

  /*
  	Orders the hand from highest to lowest,
  	which is easier for me checking the hand types later
  */
  hand.sort((cardA, cardB) => cardB.rank - cardA.rank);
  return hand;
};

const HAND_TYPES = {
  'UNNAMED': () => ({
    index: 0,
    prettyName: 'Unnamed'
  }),
  'PAIR': () => ({
    index: 1,
    prettyName: 'Pair'
  }),
  'TWO_PAIR': () => ({
    index: 2,
    prettyName: 'Two pairs'
  }),
  'THREE_KIND': () => ({
    index: 3,
    prettyName: 'Three of a kind'
  }),
  'STRAIGHT': () => ({
    index: 4,
    prettyName: 'Straight'
  }),
  'FLUSH': () => ({
    index: 5,
    prettyName: 'Flush'
  }),
  'FULL_HOUSE': () => ({
    index: 6,
    prettyName: 'Full House'
  }),
  'FOUR_KIND': () => ({
    index: 7,
    prettyName: 'Four of a Kind'
  }),
  'STRAIGHT_FLUSH': () => ({
    index: 8,
    prettyName: 'Straight Flush'
  }),
  'ROYAL_FLUSH': () => ({
    index: 9,
    prettyName: 'Royal Flush'
  })
};

// Card type checker methods
const isRoyalFlush = (hand = []) => {
  return isFlush(hand) && isStraight(hand, true);
};
const isStraightFlush = (hand = []) => {
  return isFlush(hand) && isStraight(hand);
};
const getKindCounts = (hand = [], desiredCount = 0) => {
  const kindCounts = {};
  hand.forEach(card => {
    kindCounts[card.rank] = kindCounts[card.rank] ? kindCounts[card.rank] + 1 : 1;
  });

  // Returns how many instances for a specified rank count there are.
  return Object.values(kindCounts).filter(count => count === desiredCount).length;
};
const isFullHouse = (hand = []) => {
  const has3OfKind = getKindCounts(hand, 3) === 1;
  const has2OfKind = getKindCounts(hand, 2) === 1;
  return has3OfKind && has2OfKind;
};
const isFlush = (hand = []) => {
  const firstCardSuit = hand[0].suit;
  return hand.map(card => card.suit).filter(suit => suit === firstCardSuit).length === 5;
};
const isStraight = (hand = [], isRoyal = false) => {
  // NOTE: Ace is 14, TODO: refactor if in the mood for it
  const firstCardCheck = isRoyal ? hand[0].rank === 14 : true;
  if (firstCardCheck &&
  // Note: Below checks are not ideal, but I am optimizing for laziness.
  hand[1].rank === hand[0].rank - 1 && hand[2].rank === hand[1].rank - 1 && hand[3].rank === hand[2].rank - 1 && hand[4].rank === hand[3].rank - 1
  // TODO: mod for low Aces if having the time or mood.
  ) {
    return true;
  }
  return false;
};

// The main export
const determineHandType = (hand = []) => {
  if (isRoyalFlush(hand)) {
    return HAND_TYPES.ROYAL_FLUSH().index;
  } else if (isStraightFlush(hand)) {
    return HAND_TYPES.STRAIGHT_FLUSH().index;
  } else if (getKindCounts(hand, 4) === 1) {
    return HAND_TYPES.FOUR_KIND().index;
  } else if (isFullHouse(hand)) {
    return HAND_TYPES.FULL_HOUSE().index;
  } else if (isFlush(hand)) {
    return HAND_TYPES.FLUSH().index;
  } else if (isStraight(hand)) {
    return HAND_TYPES.STRAIGHT().index;
  } else if (getKindCounts(hand, 3) === 1) {
    return HAND_TYPES.THREE_KIND().index;
  } else if (getKindCounts(hand, 2) === 2) {
    return HAND_TYPES.TWO_PAIR().index;
  } else if (getKindCounts(hand, 2) === 1) {
    return HAND_TYPES.PAIR().index;
  } else {
    return HAND_TYPES.UNNAMED().index;
  }
};

const displayCards = () => {
  const gameboardEl = document.getElementById('gameboard');
  if (gameboardEl) {
    // removes hiding class from card elements in player hand
    const playerEls = gameboardEl.querySelectorAll('.player');
    playerEls.forEach(playerEl => {
      if (playerEl.classList.contains('hiding-card')) {
        playerEl.classList.remove('hiding-card');
      }
    });
  }
};

const DEFAULT_PLAYER_PROPERTIES = () => ({
  hand: [],
  handType: undefined
});

const names = ['Lick Jowlger', 'Faux Paw', 'Rex', 'Clawblerone', 'Chewed Paw', 'Andy Warhowl', 'Chewbarka', 'Indiana Bones', 'Boba Fetch', 'Jabba the Mutt', 'Dumbledog', 'Mutt Damon', 'Droolius Caesar', 'Dog Gonnit', 'Hot Diggity', 'Wishbone', 'Rin Tin Tin', 'Lassie', 'Snowwy', 'Marmaduke', 'Scoobert Doo'];
const getRandomDoggoName = () => {
  const randomNameIndex = Math.floor(Math.random() * names.length);
  return names[randomNameIndex];
};

/* Player format will look like so:
	{
		id: #,
		hand: [],
		handType: undefined
	}
*/
const setPlayers = (opponentCount = 1, preferredName = 'You') => {
  // The user for this application
  const players = [];
  players.push({
    id: 0,
    name: preferredName,
    ...DEFAULT_PLAYER_PROPERTIES()
  });

  // The opponent player bots
  for (let i = 0; i < opponentCount; i++) {
    players.push({
      id: i + 1,
      name: getRandomDoggoName(),
      ...DEFAULT_PLAYER_PROPERTIES()
    });
  }
  return players;
};

const sortTieBreak = (handA, handB) => {
  let sortDirection = 0; // defaults as a tied score
  for (let i = 0; i < 5; i++) {
    if (handA[i].rank !== handB[i].rank) {
      // See sorting format explanation in sortForRoundWinner() below
      sortDirection = handA[i].rank < handB[i].rank ? 1 : -1;
      break;
    }
  }
  return sortDirection;
};
const sortForRoundWinner = (playerA, playerB) => {
  if (playerA.handType < playerB.handType) {
    return 1; // Higher hand type score
  } else if (playerA.handType > playerB.handType) {
    return -1; // Lower hand type score
  } else {
    // Equivalent hand type score
    return sortTieBreak(playerA.hand, playerB.hand);
  }
};

const setSuitSpanTag = (color = 'black', suitEntityCode = '') => `
	<span class="${color}">&${suitEntityCode};</span>
`;
const renderPlayButton = () => {
  const uiEl = document.getElementById('ui');
  if (uiEl) {
    uiEl.innerHTML = `
			<button id="btn-play" class="btn">
				${setSuitSpanTag('black', 'clubs')}
				${setSuitSpanTag('red', 'hearts')}
				PLAY
				${setSuitSpanTag('red', 'diams')}
				${setSuitSpanTag('black', 'spades')}
			</button>
		`;
    return document.getElementById('btn-play');
  }
  return;
};

// Utility methods
const setSuitPTag = (color = 'black', content = '') => `
	<p class="suit ${color}">${content}</p>
`;
const getCardSymbolEntity = suit => {
  switch (suit) {
    case 'heart':
      return setSuitPTag('red', '&hearts;');
    case 'diamond':
      return setSuitPTag('red', '&diams;');
    case 'spade':
      return setSuitPTag('black', '&spades;');
    case 'club':
      return setSuitPTag('black', '&clubs;');
    default:
      return '';
  }
};
const getCardNumberSymbol = rank => {
  switch (rank) {
    case 14:
      return 'A';
    case 13:
      return 'K';
    case 12:
      return 'Q';
    case 11:
      return 'J';
    default:
      return rank;
  }
};
const renderCard = card => `<li class="card">
	${getCardSymbolEntity(card.suit)}
	<p class="rank">${getCardNumberSymbol(card.rank)}</p>
</li>`;

// Main export
const renderPlayers = (players = []) => {
  const gameboardEl = document.getElementById('gameboard');
  if (gameboardEl) {
    players.forEach((player, p) => {
      const playerName = player.name || `Player #${player.id}`;
      // Set player image file
      const dogImgNum = Math.floor(Math.random() * 7) + 1;
      const imgRef = player.id === 0 ? '/assets/project-previews/poker-pawty/imgs/cat-paws.png' : `/assets/project-previews/poker-pawty/imgs/dog-paws-${dogImgNum}.png`;
      // Set human-friendly hand type name
      const isUnnamedHandType = player.handType === HAND_TYPES.UNNAMED().index;
      const prettyHandType = isUnnamedHandType ? 'Basic hand' : Object.values(HAND_TYPES).find(val => val().index === player.handType)().prettyName;

      /* TODO: 
      		- Refactor the format string to its own function
      		- Update aria label to not give away hand while hidden
      */
      gameboardEl.insertAdjacentHTML('beforeend', `
				<div
					class="player hiding-card"
					data-player="${player.id}"
					${p === 0 ? 'data-is-winner="true"' : ''}
					aria-label="The paws of ${playerName} jutting from the edge of the screen. ${playerName} is holding a ${prettyHandType}"
				>
					<ul class="hand">
						${player.hand.map(renderCard).join('')}
					</ul>
					<img class="paws" src="${imgRef}" aria-hidden="true" />
					<p data-hand-type="( ${prettyHandType} )">${playerName}</p>
				</div>
			`);
    });
  }
};

const renderWinnerAnnouncement = (player = {}) => {
  const uiEl = document.getElementById('ui');
  if (uiEl) {
    // Clear it
    uiEl.innerHTML = '';

    // Set up announcement as new content
    const isUnnamedHandType = player.handType === HAND_TYPES.UNNAMED().index;
    const winReason = isUnnamedHandType ? 'a higher card' : Object.values(HAND_TYPES).find(val => val().index === player.handType)().prettyName;
    uiEl.innerHTML = `<p id="winner-announcement">
			${player.name}<br />
			<small>won the game with a</small><br />
			<strong>${winReason}</strong>!
		</p>`;
  }
};

// NOTE: Keeping this here for now
const announceWinner = () => {
  displayCards();
  renderWinnerAnnouncement(players[0]);
};

// Get details from player to slightly personalize things
const usersPreferredName = prompt(`What name would you like to go by?\n\nDefault is "You".`) || 'You';
const playerCount = askPlayerCount();

// Ladies && gentlemen, let's start the game~
const players = setPlayers(playerCount, usersPreferredName);
players.forEach(player => {
  player.hand = dealHand();
  player.handType = determineHandType(player.hand);
});
/* NOTE: 
		This is my lazy way to pin a winning player
		for this speed of a project, I think.
*/
players.sort(sortForRoundWinner);

// Render the "game" viewport
renderPlayers(players);
// Set up the only thing that you can really interact with
const playBtnEl = renderPlayButton();
if (playBtnEl) {
  playBtnEl.addEventListener('click', announceWinner);
}
