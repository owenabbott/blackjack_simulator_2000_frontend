"use strict"



function placeBet(){
  //click event happens on clicking place bet.
  //sends fetch event creating the user's bet for that round: 
  //document.querySelector(".users_bet").value
  // .then(startGame())
}

function findUser(data, name){
  data.forEach((player) => {
    if (player[name] === name){
      return player
    }
  })
}

document.getElementById("New_Round").addEventListener('click', function(){
  toggleNewRoundButton()
  startGame()
})


let placeBetButton = document.getElementById("place_bet")

placeBetButton.addEventListener('click', function(event){
  event.preventDefault();
    let formData = {
       bet_amount: document.getElementById("bet_amount").value,
       user_id: document.getElementById("player_id").innerText
      }

  fetch('http://localhost:3000/user_bets/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({formData})
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("player_bet_id").innerHTML = `${data.id}`
      document.getElementById("player_bet").innerHTML = `Your Wager: ${data.bet_amount}`
    })

  
  startGame()

})


let createUserButton = document.getElementById("create_user")

createUserButton.addEventListener('click', function(event){
  event.preventDefault();
    let formData = {
      name: document.querySelector(".user_name").value,
      bank_account: document.querySelector(".user_bank").value
    }
  console.log(formData)
  fetch('http://localhost:3000/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({formData})
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("player_id").innerHTML = `${data.id}`
      document.getElementById("player_bank_account").innerHTML = `Your Bank Account: ${data.bank_account}`
    })
  fetchBots()
  toggleBetForm()
  toggleUserForm()

})




function toggleUserForm(){
  if (document.getElementById("New_User").style.display === 'none'){
    document.getElementById("New_User").style.display = 'inline'
  } else {
    document.getElementById("New_User").style.display = 'none'
  }
}




function listify(data, number){
  let html = ''
  if (number > 1){
  data.forEach(bot => html+= 
  `<div id='${bot.name}_hand'>
  
  </div>
  <div id="${bot.name}_total"></div>
  <div id='${bot.name}_bank_account'>
  <h4>${bot.name}'s Bank Account: ${bot.bank_account}</h4></div>
  <div id="${bot.name}_wager"></div>`)
  document.getElementById("bot_container").innerHTML = html
  } else if (number === '1'){
  html += `<div id='${data[1].name}_hand'>
  
  </div>
<div id="${data[1].name}_total"></div>
<div id='${data[1].name}_bank_account'>
<h4>${data[1].name}'s Bank Account: ${data[1].bank_account}</h4>
</div>
<div id="${data[1].name}_wager"></div>`
document.getElementById("bot_container").innerHTML = html
  }
};


function fetchBots(){
  let numPlayers = document.querySelector(".other_players").value
    fetch('http://localhost:3000/bots/')
      .then(res => res.json())
      .then(data => listify(data, numPlayers))
}





function calculateWhoWon(){

  
  let userId = parseInt(document.getElementById("player_id"))
  let playerBankAccount = parseInt(document.getElementById("player_bet").innerHTML.split(" ")[2])
  let wager = parseInt(document.getElementById("player_bank_account").innerHTML.split(" ")[3])



  hitMeButton.style.display = 'none'
  stayButton.style.display = 'none'
  doubleDownButton.style.display = 'none'


  const userTotal = calculateTotal(userHand)
  const dealerTotal = calculateTotal(dealerHand)
  if (userTotal > dealerTotal && userTotal <= 21){
    document.getElementById("Won").style.display = "inline"
    fetch(`http://localhost:3000/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({bank_account: wager + playerBankAccount})
  })
    .then(res => res.json())
    .then(data => document.getElementById("player_bank_account").innerHTML = `Your Bank Account: ${data.bank_account}`)
  

  } else if (userTotal === dealerTotal && userTotal <= 21) {
    document.getElementById("tie").style.display = "inline"
    document.getElementById("Blackjack!").style.display = 'none'

  } else if (userTotal < dealerTotal && dealerTotal <= 21){
    document.getElementById('dealer_won').style.display = 'inline'

    fetch(`http://localhost:3000/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({bank_account: wager - playerBankAccount})
    })
      .then(res => res.json())
      .then(data => document.getElementById("player_bank_account").innerHTML = `Your Bank Account: ${data.bank_account}`)

  } else if (dealerTotal > 21 && userTotal <= 21){
    document.getElementById("dealer_busted").style.display = 'inline'
    document.getElementById("Won").style.display = "inline"
    toggleNewRoundButton()

    fetch(`http://localhost:3000/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({bank_account: wager + playerBankAccount})
    })
      .then(res => res.json())
      .then(data => document.getElementById("player_bank_account").innerHTML = `Your Bank Account: ${data.bank_account}`)
  }
  // toggleNewRoundButton() <-- Putting this here should cause it to happen automatically no matter what condition in my understanding. But for some reason it's not doing so.
}



function dealBotsIn(){
  if (document.getElementById("Wild Bill Hickok_hand")){
    wildBillHand.push(drawCard())
    let value = wildBillHand[wildBillHand.length-1].value
    let suit = wildBillHand[wildBillHand.length-1].suit
    let card = document.getElementById(`hickok_${value}_${suit}`)
    card.style.display = 'inline'
    document.getElementById('Wild Bill Hickok_total').innerHTML = `Wild Bill Hickok's Total: ${calculateTotal(wildBillHand)}`
  }
  if (document.getElementById("Wyatt Earp_hand")){
    wyattHand.push(drawCard())
    let value = wyattHand[wyattHand.length-1].value
    let suit = wyattHand[wyattHand.length-1].suit
    let card = document.getElementById(`wyatt_${value}_${suit}`)
    card.style.display = 'inline'
    document.getElementById('Wild Bill Hickok_total').innerHTML = `Wild Bill Hickok's Total: ${calculateTotal(wildBillHand)}`
  }
}


function toggleGameButtons(){
  if (hitMeButton.style.display === 'none'){
    hitMeButton.style.display = 'inline'
    stayButton.style.display = 'inline'
    doubleDownButton.style.display = 'inline'
  } else {
    stayButton.style.display = 'none'
    doubleDownButton.style.display = 'none'
    hitMeButton.style.display = 'none'
  }
}



let playerContainer = document.getElementById("player_hand")
let dealerContainer = document.getElementById("dealer_hand")
let wyattContainer = document.getElementById("Wyatt Earp_hand")
let hickokContainer = document.getElementById("Wild Bill Hickok_hand")

/Users/owenabbott/Development/code/blackjack_backend/src/index.js
//calls when 'fetching' new round. Alternatively, could call initially before anything happens, and then a separate function hiding all displays could be called when starting new round.
//new round will also have to reset player total.

function generateDeck(){

  let suits = ["Hearts", "Spades", "Clubs", "Diamonds"]
  let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"]
  let playerHTML = ''
  let dealerHTML = ''
  let deck = []
  for (let suit of suits){
    for (let value of values){
      deck.push({suit: suit, value: value})
      playerHTML += `<img src="images/${suit}${value}.png" alt="${value} of ${suit}" id="player_${value}_${suit}" style="display: none;" class="playing_card"></img>`
      dealerHTML += `<img src="images/${suit}${value}.png" alt="${value} of ${suit}" id="dealer_${value}_${suit}" style="display: none;" class="playing_card"></img>`
      if (document.getElementById("Wild Bill Hickock_hand")){
        document.getElementById("Wild Bill Hickock_hand").innerHTML += `<img src="images/${suit}${value}.png" alt="${value} of ${suit}" id="hickok_${value}_${suit}" style="display: none;"></img>`
      }
      if (document.getElementById("Wyatt Earp_hand")){
        document.getElementById("Wyatt Earp_hand").innerHTML += `<img src="images/${suit}${value}.png" alt="${value} of ${suit}" id="wyatt_${value}_${suit}" style="display: none;"></img>`
      }
    }
  }

  dealerHTML += `<img src="images/card_back.png" alt="Card Back" id="card_back" style="display: none;"></img>`
  playerContainer.innerHTML = playerHTML
  dealerContainer.innerHTML = dealerHTML
  return deck
};


// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------


const hitMeButton = document.getElementById("hit_me")
const stayButton = document.getElementById("stay")
const doubleDownButton = document.getElementById("double_down")

doubleDownButton.addEventListener('click', function(e){
  e.preventDefault()
  let wager = parseInt(document.getElementById("player_bank_account").innerHTML.split(" ")[3])
  let player_bet_id = document.getElementById("player_bet_id").innerHTML

  fetch(`http://localhost:3000/user_bets/${player_bet_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id: parseInt(player_bet_id), user_bet: wager * 2})
  })

    .then(res => res.json())
    .then(data => document.getElementById("player_bet").innerHTML = `Your Wager: ${data.bet_amount}`)

})


hitMeButton.addEventListener('click', hitMe)
stayButton.addEventListener('click', userStayed)
document.getElementById('split').addEventListener('click', split)



let playerTotal = document.getElementById("player_total")
let dealerTotalContainer = document.getElementById("dealer_total")


function calculateTotal(hand){
  let total = 0
  hand.forEach(card => {
    if (parseInt(card.value) > 0){
      total += parseInt(card.value)
    } else if (card.value === "A" && total <= 10){
      total += 11
    } else if (card.value === "A" && total > 10) {
      total += 1
      card.value = 1
    } else {
      total += 10
    }
  })
};

//------------------------------------------
// General BlackJack Rules
//------------------------------------------
let wildBillHand = []
let wyattHand = []

let dealerHand = []
let userHand = []
let userHand2 = []
let userHand3 = []
let userHand4 = []

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }
}

let deck = generateDeck()
//Calls when fetching round, but for now, it's just "deck" as defined above.

function drawCard(){
  //randomizing the index ensures the deck is always 'shuffled.'
  let cardIndex = Math.floor(Math.random() * deck.length)
  let card = deck[cardIndex]
  deck.splice(cardIndex, 1)
  return card
}


function calculateTotal(hand){
  let total = 0
  hand.forEach(card => {
    if (parseInt(card.value) > 0){
      total += parseInt(card.value)
    } else if (card.value === "A" && total <= 10){
      total += 11
    } else if (card.value === "A" && total > 10) {
      total += 1
      card.value = 1
    } else {
      total += 10
    }
  })
  return total
};




function swapAceValue(){
  if (userHand.find(card => card.value ==="A")){  
  let ace = userHand.find(card => card.value === "A")
  ace.value = 1
  }
}

function checkIfBust(){
  let aces = []
  aces.push(userHand.find(card => card.value === "A"))
  // let bust = document.getElementById("busted")
  let total = calculateTotal(userHand)
  // console.log(typeof aces[0])
  if (total > 21 && typeof aces[0] != "undefined"){
    swapAceValue(userHand)
    total = calculateTotal(userHand)
    return total
  } else if (total > 21 && typeof aces[0] === "undefined"){
    bust.style.display = "inline"

  }
}

//Will be linked to player click event:
function hitMe(){
  console.log(userHand)
  userHand.push(drawCard())
  let value = userHand[userHand.length-1].value
  let suit = userHand[userHand.length-1].suit
  let card = document.getElementById(`player_${value}_${suit}`)
  card.style.display = 'inline'
  checkIfBust()
  playerTotal.innerHTML = `<h4>${calculateTotal(userHand)}</h4>`
  if (calculateTotal(userHand) === 21){
    document.getElementById("Blackjack!").style.display = "inline"
  } else if (calculateTotal(userHand) != 21){
    document.getElementById("Blackjack!").style.display = "none"
    //There's no reason for a person to bet on a 'soft' 21, but as it isn't forbidden it is a possibility. The above line is responsible for re-hiding the 'blackjack' div.
  }
  document.getElementById("double_down").style.display = 'none'
  return userHand
}

function checkIfSplitPossible(){
  if (userHand.length === 2 && userHand[0].value === userHand[1].value){

  }
}


function split(event){

  document.getElementById("splitting?").style.display = 'inline'
}


function dealerDraw(){
  dealerHand.push(drawCard())
  let value = dealerHand[dealerHand.length-1].value
  let suit = dealerHand[dealerHand.length-1].suit
  let card = document.getElementById(`dealer_${value}_${suit}`)

  if (dealerHand.length > 1){
    card.style.display = 'inline'
  } else if (dealerHand.length > 2){
    document.getElementById("card_back").style.display = 'none'
    calculateTotal(dealerHand)
    dealerHand.forEach(card => {
      document.getElementById(`dealer_${card.value}_${card.suit}`).style.display = 'inline'
    })
  } else if (dealerHand.length === 2 && calculateTotal(dealerHand) === 21 && 21 > calculateTotal(userHand)){
    document.getElementById("card_back").style.display = 'none'
    calculateWhoWon()
    dealerHand.forEach(card => {
      document.getElementById(`dealer_${card.value}_${card.suit}`).style.display = 'inline'

    toggleGameButtons()

    }) 
  } else if (calculateTotal(dealerHand) === 21 && calculateTotal(userHand) === 21) {
    document.getElementById("tie").style.display = 'inline'

  }
}
//I can't remember if this is Ruby or Javascript, but I think the above can be refactored into a "Case" statement in future update.



//links to click event on a stay button
function userStayed(){
  toggleGameButtons()
  toggleNewRoundButton()
  dealerTotalContainer.style.display = 'inline'
  dealerHand.forEach(card => {
    document.getElementById(`dealer_${card.value}_${card.suit}`).style.display = 'inline'
  })
  dealerTotalContainer.innerHTML = calculateTotal(dealerHand)
  //the above has to stay here in case the dealer stays at two, it is not redundant.
  dealerTotalContainer.style.display = 'inline'
  document.getElementById("card_back").style.display = 'none'
  //Future refactoring reminder: I put the above two line in other places, but there's a glitch where it isn't applying when it needs to. P
  //Realized I could just put it here, which makes those other spots obsolete. 
  //I'll have to add a conditional to make sure this doesn't run until the user exhausted options down the line, when splitting is introduced.
  while (calculateTotal(dealerHand) < 17){
    dealerDraw()
    dealerTotalContainer.innerHTML = calculateTotal(dealerHand)
    //the above has to stay here to ensure the total updates correctly. Refactor note: turn it into a helper function.
  }
  calculateWhoWon()
}


function startGame(){
  playerContainer.querySelectorAll(".playing_card").forEach(card => card.style.display = 'none')
  dealerContainer.querySelectorAll(".playing_card").forEach(card => card.style.display = 'none')
  document.getElementById("Won").style.display = "none"
  document.getElementById("tie").style.display = "none"
  document.getElementById("dealer_busted").style.display = 'none'
  document.getElementById("tie").style.display = "none"
  document.getElementById("Blackjack!").style.display = 'none'
  document.getElementById("busted").style.display = 'none'
  document.getElementById("dealer_won").style.display = 'none'

  while (userHand.length > 0){
    userHand.shift()
  }
  while (dealerHand.length > 0){
    dealerHand.shift()
  }

  hitMe()
  hitMe()
  dealerDraw()
  dealerDraw()
  toggleGameButtons()
  faceDown()

  //function for bots to draw, if bots exist.
}

// Must be a HTML/CSS/JS frontend with a Rails API backend. 
// All interactions between the client and the server should be handled asynchronously (AJAX) and use JSON 
// as the communication format.
//-------> I'm not sure if rendering cards counts as a client interaction so I think I can have them rendered as is. 
//-------> If not, I can create a card object on the backend and render them up with Fetch, but they won't have a relation with anything else as that wouldn't be well optimized and would cause bugs in my current schema.


// Backend must render a resource with at least one has-many relationship. 
// ------> user has many hands because of splitting. If I can't get to splitting, then:
// ------> user has many Transactions, through rounds. This can display on a user 'transactions history' list or 'high score' list. The route would be an index showing all Users and their properties.

// For example, if we were building Instagram, we might display a list of photos with associated comments.

// The backend and frontend must collaborate to demonstrate Read, Create, and either Update or 
//Delete for at least two of your models. 

// ------> user can be created, name/bank account value can be updated, and history can be 'read' on previously mentioned score list.

// ------> Raza said he was willing to let the second model condition slide because of all the logic involved in blackjack, but if I get creative and have time I can come back to this.
// ------> was thinking maybe I could add bot players, update their names, see their histories, etc. That would be a lot of work but doable if I put a few days into this after the project is complete, just to make the portfolio more impressive.
// ------> 

//The results of each action should be diplayed to the user without a page refresh.
//--------> "new round" should wipe the slate clean. That's the last 'refresh' replacement I need to implement, but I need to knit the backend together with the front first


function toggleNewRoundButton(){
  let newRoundButton = document.getElementById("New_Round")
    if (newRoundButton.style.display === 'none'){
      newRoundButton.style.display = 'inline'
  } else {
    newRoundButton.style.display = 'none'
  }
}



//call this function when player posts create data for user
function toggleUserForm(){
  
  if (document.getElementById("New_User").style.display === 'none'){
    document.getElementById("New_User").style.display ='inline'
  } else {
    document.getElementById("New_User").style.display = 'none'
  }
};

//call this function when player clicks new round
function toggleBetForm(){
  if (document.getElementById("Placing_Bet").style.display === 'none'){
    document.getElementById("Placing_Bet").style.display = 'inline'
  } else {
    document.getElementById("Placing_Bet").style.display = 'none'
  }
};

//call this function when total is calculated
function toggleNewRoundButton(){
  const newRoundButton = document.getElementById("New_Round")
  if (newRoundButton.style.display === 'none'){
    newRoundButton.style.display = 'inline'
  } else {
    newRoundButton.style.display = 'none'
  }
}

//call this function when starting a new round.
function faceDown(){
  const cardBack = document.getElementById("card_back")
  if (cardBack.style.display === 'none'){
    cardBack.style.display = 'inline'
  } else {
    cardBack.style.display = 'none'
  }
}

//number of bots:
document.querySelector(".other_players").value
//amount of money in user bank account:
document.querySelector(".user_bank").value 
//player name:
document.querySelector(".user_name").value
//player bet:
document.querySelector(".users_bet").value


function toggleBots(){
  let botContainer = document.getElementById('bot_container')
  if (botContainer.style.display === 'none'){
    botContainer.style.display = 'inline'
  } else {
    botContainer.style.display = 'none'
  }
}