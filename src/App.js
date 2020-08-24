import React, { Component } from 'react'
import StartForm from './components/StartForm'
import Table from './components/Table'
import BetForm from './components/BetForm'
import 'semantic-ui-css/semantic.min.css'
import './App.css';
import Header from './components/Header'
import HighScores from './components/HighScores'
import Credits from './components/Credits'

export default class App extends Component {
  constructor(){
    super()
    this.state = {
      deck: [],
      playerHand: [],
      dealerHand: [],
      bot1Hand: [],
      bot2Hand: [],
      numberOfBots: 1,
      //create while loop that renders BotHands, which will be stateful components, with a state that includes their cards, I guess
      //switches to true after player submits initial form:
      initiated: false,
      displayBetForm: false,
      //if initiated = false, betform display is none
      betAmount: 0,
      gameStarted: false,
      stayed: false,
      //tried to turn message into an object containing dealer and player, but react doesn't like that and wants me to use an array instead. index 1 is player message, index 0 is dealer.
      //Just realized I could refactor it into an array *of objects* and then use the keys. More descriptive, less need for commenting. Will refactor this later. Something like  "message: [{dealerMessage: ''}, {playerMessage: ""}, {bot1Message: ""}, {bot2Message: ""}]""
      message: ["", "", "", ""],
      endGameMessage: "",
      // refactoring/key: replace with totals: [{playerTotal: 0}, {dealerTotal: 0}, {bot1Total: 0}, {bot2Total: 0}] and rewrite functions to accomodate.
      music: true,
      eighties: false,
      botsStayed: false,
      doubled: false,
      bankAccount: 0,
      displayTopWinners: false,
      highScoresArr: [],
      currentPlayerId: [],
      warningMessage: "",
      secondGame: false,
      credits: false
    }
  }




  botsStayed=()=>{
    if (this.state.numberOfBots === 1 && this.state.bot1Hand >= 1 && this.calculateTotal(this.state.bot1Hand) >= 17){
      this.setState({
        botsStayed: true
      })
    } else if (this.state.numberOfBots === 2 && this.state.bot2Hand >= 1 && this.calculateTotal(this.state.bot1Hand) >= 17 && this.calculateTotal(this.state.bot2hand) >= 17){
      this.setState({
        botsStayed: true
      })
    } else if (this.state.numberOfBots === 0){
      this.setState({
        botsStayed: true
      })
    }
  }
  
  generateDeck=()=>{
    const suits = ["Hearts", "Spades", "Clubs", "Diamonds"]
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"]
    const newDeck = []
    for (let suit of suits){
      for (let value of values){
        newDeck.push({suit: suit, value: value})
    }
  }
    this.playAudio("shuffle")
    this.setState({
      deck: newDeck
    })
  }
  
  



  calculateTotal=(hand)=>{
    let total = 0
    
    // let newHand = hand
    // newHand.forEach(card => {
    //   if (card.value === "A"){
    //     let newCard = card
    //     let index = newHand.indexOf(card)
    //     newHand.splice(index, 1)
    //     newHand.push(newCard) 
    //   }
    // })
    

    hand.forEach(card => {
      if (parseInt(card.value) > 0){
        total += parseInt(card.value)
      } else if (card.value === "A" && total <= 10){
        total += 11
      } else if (card.value === "A" && total > 10) {
        total += 1
        // card.value = 1
      } else {
        total += 10
      }
    })

    return total
  };

  swapAceValue=(hand)=>{
    const newHand = hand
    if (newHand.find(card => card.value ==="A")){  
      const ace = hand.find(card => card.value === "A")
      ace.value = 1
      this.setState({
        hand: newHand
      })
    }
  }


  checkIfBust = (hand, messageIndex) => {
    let aces = []
    let newMessage = this.state.message


    aces.push(hand.find(card => card.value === "A"))
    // let bust = document.getElementById("busted")
    let total = this.calculateTotal(hand)

    // console.log(typeof aces[0])
    if (total > 21 && typeof aces[0] != "undefined"){
      //swapAceValue changes the state of hand, have to use recursion here to make sure it works right. I don't remember what my reasoning is but it doesn't work any other way.
      // this.checkIfBust(hand, messageIndex)
      this.swapAceValue(hand)
      aces.splice(0, 1)
      total = this.calculateTotal(hand)
      this.checkIfBust(hand, messageIndex)
      //if the stack collapses again, will try setting total to equal this.checkIfBust

    } else if (total > 21 && typeof aces[0] === "undefined"){
      messageIndex === 1 ? newMessage[messageIndex]=`You busted with ${total}` : newMessage[messageIndex]=`Dealer busted with ${total}.`
      this.setState({
        message: newMessage,
      })
      if (this.state.message[1].split(" ")[0]==="You"){
        this.playerLoss()
        this.playAudio("lost")
        this.setState({
          stayed: true,
          endGameMessage: "You lost!",
          bankAccount: this.state.bankAccount - this.state.betAmount
        })

        if (this.state.numberOfBots >= 1 && this.calculateTotal(this.state.dealerHand) <= 21){
          const testInterval = setInterval(()=>this.computerDraw(this.state.bot1Hand, undefined, testInterval, 17), 500)
        } else if (this.state.numberOfBots === 0){
          this.setState({
            botsStayed: true
          })
        }
      }
    } else {
      messageIndex === 1 ? newMessage[messageIndex]=`Your total is ${total}` : newMessage[messageIndex]=`Dealer total is ${total}`
      this.setState({
        message: newMessage
      })
    }
    return total
  }












  handleStartFormSubmit=(e)=>{
    e.preventDefault()
    //e.target.name is the player name. I don't know if this will be relevant in this particular iteration of the project.
    let formData = e.target[0].value
    if (formData.replace(/ /g, "") === ""){
        this.setState({
          warningMessage: "Name cannot be left blank"
        })
      } else {
      this.setState({
        // bankAccount: parseInt(e.target[1].value),
        initiated: true,
        displayBetForm: !this.state.displayBetForm,
        bankAccount: 2000,
        warningMessage: ""
      })

      fetch('https://blackjack-simulator-backend.herokuapp.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({formData})
      })
        .then(res => res.json())
        .then(userData => {
          this.setState({
            currentPlayerId: userData.id,

          })
        })
      //fetch request creating user based on name, default bank account is 2000

      this.generateDeck()

      if (this.state.secondGame===false){
        this.playAudio("music")
      }
    }
  }

  handleDoubleDown=()=>{
    let newBet = this.state.betAmount * 2
    this.setState({
      betAmount: newBet,
      doubled: true
    })
    this.handleHit()
    this.handleStand()
  }


  playerWin=()=>{
   fetch(`https://blackjack-simulator-backend.herokuapp.com/users/${this.state.currentPlayerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({bank_account: this.state.bankAccount})
    })
    .then(res=>res.json())
    .then(data=>console.log(data))
  }

  playerLoss=()=>{
    fetch(`https://blackjack-simulator-backend.herokuapp.com/users/${this.state.currentPlayerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({bank_account: this.state.bankAccount})
    })
    .then(res=>res.json())
    .then(data=>console.log(data))
  }

  playerNaturalBlackjack=()=>{
      fetch(`https://blackjack-simulator-backend.herokuapp.com/users/${this.state.currentPlayerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({bank_account: this.state.bankAccount})
    })
    .then(res=>res.json())
    .then(data=>console.log(data))
  }


  



  handleBet=(e)=>{
    e.preventDefault()
    if (e.target.bet_amount.value < 10){
      this.setState({warningMessage: "The minimum wager is 10"})
    } else if (e.target.bet_amount.value > this.state.bankAccount){
      this.setState({warningMessage: "You cannot bet more than you have"})
    } else {
      this.setState({
        betAmount: parseInt(e.target.bet_amount.value),
        numberOfBots: parseInt(e.target.bots.value),
        displayBetForm: !this.state.displayBetForm,
        gameStarted: !this.state.gameStarted,
        warningMessage: ""
      })
      console.log(typeof parseInt(e.target.bet_amount.value))
      console.log(e.target.bet_amount.value)
      const dealerInterval = setInterval(() => { this.computerDraw(this.state.dealerHand, this.state.dealerHand.length, dealerInterval) }, 550)
    }
  }

  //handleCheater=()={
    // this.setState({
    //   cheater: true
    //  when cheater is true, displays message showing the deck's hi-lo count and whether to hit or stay.
    // })
    // hi-lo card counting logic here.

  //}



  drawCard=()=>{
    const cardIndex = Math.floor(Math.random() * this.state.deck.length)
    const card = this.state.deck[cardIndex]
    const newDeck = this.state.deck
    newDeck.splice(cardIndex, 1)
    this.setState({
      deck: newDeck
    })
    this.playAudio(`dealt`)
    return card
  }

  handleHit=(optionalHandLength, optionalInterval)=>{
    console.log('testing')
    if (optionalHandLength < 2){
      const newHand = this.state.playerHand
      newHand.push(this.drawCard())
      this.setState({
        playerHand: newHand,
      })
      this.checkIfBust(this.state.playerHand, 1)
    } else if (optionalHandLength === 2) {
      clearInterval(optionalInterval)
      if (this.calculateTotal(this.state.dealerHand) === 21){
        this.handleStand()
        this.calculateWinner()
      }
    } else {
      const newHand = this.state.playerHand
      newHand.push(this.drawCard())
      this.setState({
        playerHand: newHand,
      })
      this.checkIfBust(this.state.playerHand, 1)

    }
    

    //can't think of a better way to do this with react, but the "1" represents the index in this.state.message I want to change.
  }



// <audio className="audio-element">
// <source src="https://assets.coderrocketfuel.com/pomodoro-times-up.mp3"></source>
// </audio>
// </div>


  handleNewRound=()=>{
    const newDealerHand=[]
    const newPlayerHand=[]

    this.setState({
      gameStarted: !this.state.gameStarted,
      displayBetForm: !this.state.displayBetForm,
      playerHand: newPlayerHand,
      dealerHand: newDealerHand,
      stayed: !this.state.stayed,
      message: ["", ""],
      endGameMessage: "",
      bot1Hand: [],
      bot2Hand: [],
      botsStayed: false,
    })
    if (this.state.deck.length < 20){
      this.generateDeck()
    }
  }

  handleStand=()=>{
    //need to toggle off hit and stand buttons with the 'stayed' state value, and make new round button appear, which links to the function above.
    this.setState({
      stayed: !this.state.stayed,
      doubled: false
    })
      if (this.calculateTotal(this.state.dealerHand) === 21 && this.state.dealerHand.length === 2){
        this.setState({
          usersStayed: true,
          botsStayed: true
        })
        this.calculateWinner()
      }
      else if (this.calculateTotal(this.state.dealerHand) < 17 && this.state.numberOfBots === 0){
        this.setState({
          botsStayed: true
        })
        const testInterval = setInterval(()=>this.computerDraw(this.state.dealerHand, undefined, testInterval, 17), 500)
      } else if (this.state.numberOfBots === 0){
        this.setState({
          botsStayed: true
        })
        const testInterval = setInterval(()=>this.computerDraw(this.state.dealerHand, undefined, testInterval, 17), 500)
      } else if (this.state.numberOfBots >= 1) {
        if (this.calculateTotal(this.state.bot1Hand) < 17){
          const testInterval = setInterval(()=>this.computerDraw(this.state.bot1Hand, undefined, testInterval, 17), 500)
          //add conditionals within bot1hand determining whether to pass the draw to dealerhand or bot2hand
          
        } else if (this.calculateTotal(this.state.bot1Hand) >= 17 && this.state.numberOfBots === 1 ){
          const testInterval = setInterval(()=>this.computerDraw(this.state.dealerHand, undefined, testInterval, 17), 500)
          this.setState({
            botsStayed: true
          })
        } else if (this.calculateTotal(this.state.bot1Hand) >= 17 && this.state.numberOfBots===2){
          const testInterval = setInterval(()=>this.computerDraw(this.state.bot2Hand, undefined, testInterval, 17), 500)
          // if (this.calculateTotal(this.state.bot2Hand) >= 17){
          //   console.log("THIS DOESN'T MAKE SENSE. WHY IS THIS CONDITION NEVER MET")
          //   const testInterval = setInterval(()=>this.computerDraw(this.state.dealerHand, undefined, testInterval, 17), 500)
          // }
        } 
      } else {
        this.checkIfBust(this.state.dealerHand, 0)
        
        this.calculateWinner()
      }
    
  }

  calculateWinner=()=>{

    const playerTotalArray=this.state.message[1].split(' ')
    const dealerTotalArray=this.state.message[0].split(' ')
    const playerTotal=parseInt(playerTotalArray[playerTotalArray.length-1])
    const dealerTotal=parseInt(dealerTotalArray[dealerTotalArray.length-1])

    if (playerTotal > dealerTotal && playerTotal <= 21){
      if (this.state.playerHand.length > 2 || this.state.playerHand.length === 2 && this.calculateTotal(this.state.playerHand) < 21){
        this.setState({
          endGameMessage: "You won!",
          bankAccount: this.state.bankAccount + this.state.betAmount
        })
        this.playerWin()
      } else if (this.state.playerHand.length === 2 && playerTotal === 21){
        this.setState({
          endGameMessage: "Blackjack!",
          bankAccount: this.state.bankAccount + this.state.betAmount + Math.floor(this.state.betAmount * 0.20)
        })
        this.playerNaturalBlackjack()
      }
      
      this.playAudio("win")

      //fetch request updating bank account (win)
      //update bank account message to reflect change after backend is patched.
    } else if (playerTotal === 21 && this.state.playerHand.length === 2 && dealerTotal > 21){
      this.setState({
        endGameMessage: "Blackjack!",
        bankAccount: this.state.bankAccount + this.state.betAmount + Math.floor(this.state.betAmount * 0.20)
      })
      this.playerNaturalBlackjack()
      this.playAudio("win")
    } else if (playerTotal === dealerTotal && playerTotal <= 21){
      this.setState({
        endGameMessage: "It's a tie!"
      })
      this.playAudio("lost")
      //tie
    } else if (playerTotal < dealerTotal && dealerTotal <= 21){
      this.setState({
        endGameMessage: "You lost!",
        bankAccount: this.state.bankAccount - this.state.betAmount
      })
      this.playerLoss()
      this.playAudio("lost")

      //fetch request updating bank account (loss)
      //update bank account message to reflect change after backend is patched.
    } else if (playerTotal <= 21 && dealerTotal > 21){
      this.setState({
        endGameMessage: "You won!",
        bankAccount: this.state.bankAccount + this.state.betAmount
      })
      this.playerWin()
      this.playAudio("win")
      //fetch request updating bank account (win)
      //update bank account message to reflect change after backend is patched.
    }
  }
  





  playAudio=(condition)=>{
    const neon = this.state.eighties ? "_neon":""
    if (condition === "win"){
      const audioElement = document.getElementsByClassName(`audio-win-element${neon}`)[0]
      audioElement.play()
    } else if (condition === "lost"){
      const audioElement = document.getElementsByClassName(`audio-lost-element${neon}`)[0]
      audioElement.play()
    } else if (condition === "dealt"){
      const audioElement = document.getElementsByClassName(`audio-dealt-element${neon}`)[0]
      audioElement.play()
    } else if (condition === "shuffle"){
      const audioElement = document.getElementsByClassName(`audio-shuffle-element${neon}`)[0]
      audioElement.play()
    } else if (condition === "music"){
      const audioElement = document.getElementsByClassName(`audio-music-element`)[0]
      const retroAudioElement = document.getElementsByClassName("audio-eighties-element")[0]
      this.state.eighties ? retroAudioElement.play() : audioElement.play()
    } 
  }

  pauseAudio=()=>{
    this.setState({
      music: !this.state.music
    })
    const audioElement = document.getElementsByClassName("audio-music-element")[0]
    const retroAudioElement = document.getElementsByClassName("audio-eighties-element")[0]

    if (this.state.music === true){
      audioElement.pause()
      retroAudioElement.pause()
    } else if (this.state.music === false) {
      this.state.eighties ? retroAudioElement.play() : audioElement.play()
    } 
  }



  //don't have the foggiest idea why I need a separate function for each bot, very repetitious. Having trouble getting it to work within ComputerDraw and short on time, will refactor later. 
  botDraw=(hand, optionalLength, optionalInterval, optionalTotal)=>{
    // this.botsStayed()
    const newHand = hand
    
    if (this.state.numberOfBots === 1 && optionalLength >= 2 && newHand.length === 1){
      clearInterval(optionalInterval)
      const playerBotInterval = setInterval(() => { this.handleHit(this.state.playerHand.length, playerBotInterval) }, 500)
    } else if (this.state.numberOfBots === 2 && optionalLength >= 2 && newHand.length === 1){
      clearInterval(optionalInterval)

      const newBotInterval = setInterval(() => { this.bot2Draw(this.state.bot2Hand, 2, newBotInterval) }, 500)
    }
    hand.push(this.drawCard())
    this.setState({
      hand: newHand
    })
    this.checkIfBust(hand, 2)
  }

  //this feels ridiculous.

  bot2Draw=(hand, optionalLength, optionalInterval, optionalTotal)=>{
    const newHand = hand
    // const playerBotInterval = setInterval(() => { this.handleHit(this.state.playerHand.length, playerBotInterval) }, 500)
    if (optionalLength === 2 && newHand.length === 1){
      clearInterval(optionalInterval)
      const playerBotInterval = setInterval(() => { this.handleHit(this.state.playerHand.length, playerBotInterval) }, 500)
    }
    
    hand.push(this.drawCard())
    this.setState({
      hand: newHand
    })
    this.checkIfBust(hand, 3)
  }


  // handleHit=(optionalHandLength, optionalInterval)



  computerDraw=(hand, optionalHandLength, optionalInterval, optionalTotal)=>{
    //return end condition text, which will be displayed at the bottom of the page.
    if (optionalHandLength < 2){
      const newHand = hand
      newHand.push(this.drawCard())
      this.setState({
        hand: newHand
      })
      
    }
    
    else if (optionalHandLength === 2 && this.state.numberOfBots < 1) {
      clearInterval(optionalInterval)
      const playerInterval = setInterval(() => { this.handleHit(this.state.playerHand.length, playerInterval) }, 500)

    } else if (optionalHandLength === 2 && this.state.numberOfBots >= 1) {
      clearInterval(optionalInterval)
      const botInterval = setInterval(() => { this.botDraw(this.state.bot1Hand, 2, botInterval)}, 500)


      // const dealerInterval = setInterval(() => { this.computerDraw(this.state.dealerHand, this.state.dealerHand.length, dealerInterval) }, 550)

    } else if (optionalTotal === 17 ){
      const newHand = hand
      if (this.calculateTotal(hand) < optionalTotal){
      newHand.push(this.drawCard())

      this.setState({
        hand: newHand
      })

    }
      this.checkIfBust(this.state.dealerHand, 0)
      
      if (this.calculateTotal(hand) >= 17){
        clearInterval(optionalInterval)
        if (hand === this.state.dealerHand){
        this.calculateWinner()
        } else if (hand === this.state.bot1Hand && this.state.numberOfBots === 1){
          const testInterval = setInterval(()=>this.computerDraw(this.state.dealerHand, undefined, testInterval, 17), 500)
          if (this.calculateTotal(hand) >= 17){
            this.setState({
              botsStayed: true
            })
          }
        } else if (hand === this.state.bot1Hand && this.state.numberOfBots === 2){
          const testInterval = setInterval(()=>this.computerDraw(this.state.bot2Hand, undefined, testInterval, 17), 500)
        } else if (hand === this.state.bot2Hand){
          const testInterval = setInterval(()=>this.computerDraw(this.state.dealerHand, undefined, testInterval, 17), 500)
          if (this.calculateTotal(hand) >= 17){
            this.setState({
              botsStayed: true
            })
          }
        }
      }
    }
  }

  toggleEighties=()=>{
    const audioElement = document.getElementsByClassName("audio-music-element")[0]
    const retroAudioElement = document.getElementsByClassName("audio-eighties-element")[0]
    if (this.state.music === true && this.state.eighties === true){
      this.setState({
        eighties: !this.state.eighties
      })
      retroAudioElement.pause()
      audioElement.play()
    } else if (this.state.music === true && this.state.eighties === false){
      this.setState({
        eighties: !this.state.eighties
      })
      audioElement.pause()
      retroAudioElement.play()
    } else if (this.state.music === false){
      this.setState({
        eighties: !this.state.eighties
      })
    }
    
  }

    // this.state.music ? this.playAudio("music") : console.log('null')
  
  handleWalkAway=()=>{
    //fetch request
    this.setState({
      gameStarted: false,
      displayTopWinners: true,
      initiated: true
    })
  }

  playAgain=()=>{
    const newDealerHand=[]
    const newPlayerHand=[]
    const newBot1Hand=[]
    const newBot2Hand=[]
    this.setState({
      bankAccount: 0,
      betAmount: 0,
      gameStarted: false,
      initiated: false,
      displayTopWinners: false,
      stayed: false,
      botsStayed: false,
      playerHand: newPlayerHand,
      dealerHand: newDealerHand,
      message: ["", ""],
      endGameMessage: "",
      bot1Hand: newBot2Hand,
      bot2Hand: newBot1Hand,
      secondGame: true
      
      
    })
  }

  toggleCredits=()=>{
    if (this.state.gameStarted === false){
      this.setState({
        credits: !this.state.credits
      })
    } else {
      const newLine = "\r\n"
      let message = "Pixel playing cards made by Yaoman on itch.io"
      message += newLine
      message += "https://yaomon.itch.io/playing-cards"
      message += newLine
      message += newLine
      message += "Neon mode playing cards made by mapsandapps on itch.io"
      message += 'https://mapsandapps.itch.io/synthwave-playing-card-deck-assets'
      message += newLine
      message += newLine
      message += "Font 'pixelar' from fonts.com"
      message += newLine
      message += "https://www.fonts.com/font/graviton/pixelar"
      message += newLine 
      message += newLine
      message += "Normal mode music: 8 Bit Menu (By David Renda), Royalty free music from https://www.fesliyanstudios.com"
      message += newLine
      message += newLine
      message += "Neon mode music: A Sad Touch (by John Børge Tjelta, also known as Arachno)"
      message += newLine
      message += "http://www.musikwave.com/artist/Arachno"
      message += newLine
      message += newLine 
      message += "General interface assets purchased from www.gamedevmarket.net"

      alert(message)
      
    }
  }


  render() {
    return (
      <div className={this.state.eighties ? "appNeon" : "app"}>
        <Header eighties={this.state.eighties}/>
        <Credits credits={this.state.credits}/>
        <button className="button" onClick={this.pauseAudio} style={{display: this.state.initiated ? 'inline' : 'none'}}>Toggle Music</button>
        <button className="button" onClick={this.toggleEighties} style={{display: this.state.initiated ? 'inline' : 'none'}}>Toggle Neon Mode</button>
        <button className="button" onClick={this.toggleCredits} style={{display: this.state.initiated === true  ? 'inline' : 'none'}}>Toggle Credts</button>
        <div className={this.state.eighties ? "playerFundsNeon" : "playerFunds"}>Total Funds: {this.state.bankAccount}<br/>
        Current Wager: {this.state.betAmount}</div>
        <HighScores displayTopWinners={this.state.displayTopWinners} playAgain={this.playAgain}/>
        <StartForm credits={this.state.credits} warningMessage={this.state.warningMessage} handleStartFormSubmit={this.handleStartFormSubmit} initiated={this.state.initiated} displayTopWinners={this.state.displayTopWinners}/>
        <BetForm credits={this.state.credits} warningMessage={this.state.warningMessage} handleBet={this.handleBet} display={this.state.displayBetForm} />
        <Table betAmount={this.state.betAmount} 
          betAmount={this.state.betAmount} 
          playerHand={this.state.playerHand}
          dealerHand={this.state.dealerHand}
          numberOfBots={this.state.numberOfBots}
          bot1Hand={this.state.bot1Hand} 
          bot2Hand={this.state.bot2Hand}
          gameStarted={this.state.gameStarted ? 'block' : 'none'}
          stayed={this.state.stayed}
          handleHit={this.handleHit}
          handleStand={this.handleStand}
          handleNewRound={this.handleNewRound}
          calculateTotal={this.calculateTotal}
          checkIfBust={this.checkIfBust}
          message={this.state.message}
          dealerMessage={this.state.dealerMessage}
          endGameMessage={this.state.endGameMessage}
          eighties={this.state.eighties}
          botsStayed={this.state.botsStayed}
          handleDoubleDown={this.handleDoubleDown}
          doubled={this.state.doubled}
          bankAccount={this.state.bankAccount}
          walkAway={this.handleWalkAway}
          
        />
        <audio className="audio-win-element">
          <source className="won" src={require("./audio/won.wav")}></source>
        </audio>
        <audio className="audio-win-element_neon">
          <source src={require('./audio/won_neon.wav')}></source>
        </audio>
        <audio className="audio-dealt-element">
          <source className="dealt" src={require('./audio/card_dealt.wav')}></source>
        </audio>
        <audio className="audio-dealt-element_neon">
          <source src={require('./audio/card_dealt_neon.wav')}></source>
        </audio>
        <audio className="audio-lost-element">
          <source className="lost" src={require('./audio/lost.wav')}></source>
        </audio>
        <audio className="audio-lost-element_neon">
          <source src={require('./audio/lost_neon.wav')}></source>
        </audio>
        <audio className="audio-shuffle-element">
          <source className="shuffle" src={require('./audio/shuffle.wav')}></source>
        </audio>
        <audio className="audio-shuffle-element_neon">
          <source src={require('./audio/shuffle_neon.wav')}></source>
        </audio>
        <audio className="audio-music-element" loop>
          <source className="music" src={require('./audio/music.mp3')}></source>
        </audio>
        <audio className="audio-eighties-element" loop>
          <source className="retro_music" src={require('./audio/Arachno - A Sad Touch.mp3')}></source>
        </audio>


      </div>
    )
  }
}



// start form displays here, but as I don't know routes yet, in

// in final version, table renders when this.state.initiated switches to true, and startform renders if this.state.initiated is false. 
// so there will be a conditional that toggles when player presses the button in the start form.





//bug list:
  //dealer had 20, and then hit anyway after I stayed. Haven't been able to reproduce this one
  //dealer stopped at 12. Haven't been able to reproduce this one.
  //dealer had 18 and hit anyway after I stayed, busted with 28. Don't know why this keeps happening intermittantly. 2 bots were active this time.
  //bots draw cards after the winner is calculated if the dealer gets blackjack on his initial draw
  //game breaks if user hits 'new round' while dealer still drawing
  //Dealer had 21, but didn't show his card. He bet, despite already having 21, and  got 21. 
  //Stack collapsed when dealer had more than one ace, but when conditions repeated, the error was not reproduced. Hopefully this was a one off glitch.