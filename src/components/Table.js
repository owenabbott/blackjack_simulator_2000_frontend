//this will render the dealerhand, bothand(s), playercontainer
import React, { Component } from 'react'
import DealerHand from './DealerHand'
import PlayerContainer from '../containers/PlayerContainer'
import PlayerHand from './PlayerHand'
import Bot1Hand from './Bot1Hand'
import Bot2Hand from './Bot2Hand'
import { Grid, Image } from 'semantic-ui-react'
import { Container, Divider } from 'semantic-ui-react'

export default class Table extends Component {

    // addBot=()=>{
    //     return <BotHand />
    // }

    // generateBots=()=>{
    //     let i = 0
    //     while (i < this.props.numberOfBots){
    //         i += 1
    //         return this.addBot()
    //     }
    // }
    //why doesn't the above work? Hard coding for the sake of time, since a standard in casinos is a limit of 3 players.

    renderButtons=()=>{
        if (this.props.playerHand.length >= 2 && this.props.stayed != true){
        return <div className="player buttons"> 
                <button className="button" onClick={this.props.handleHit} style={{display: this.props.stayed ? 'none' : 'inline'}}>Hit Me</button>
                <button className="button" onClick={this.props.handleStand} style={{display: this.props.stayed ? 'none' : 'inline'}}>Stand</button>
                <button className="button" onClick={this.props.handleDoubleDown} style={{display: this.props.playerHand.length === 2 && this.props.doubled === false && this.props.bankAccount >= this.props.betAmount * 2? "inline" : "none"}}>Double Down</button>
            </div>
        } 
    }



    render() {
        let playerContainer
        if (this.props.numberOfBots === 2){
            playerContainer = [<Grid>
                <Grid.Row>
                <Grid.Column width={5}>
                    <PlayerHand hand={this.props.playerHand} bankAccount={this.props.bankAccount} calculateTotal={this.props.calculateTotal} checkIfBust={this.props.checkIfBust} message={this.props.message[1]} eighties={this.props.eighties} betAmount={this.props.betAmount}/>  
                    {this.renderButtons()}
                    
                </Grid.Column>
                <Grid.Column width={6}>
                    <Bot2Hand hand={this.props.bot2Hand} eighties={this.props.eighties} calculateTotal={this.props.calculateTotal}/>
                </Grid.Column>
                <Grid.Column width={5}>
                    <Bot1Hand hand={this.props.bot1Hand} eighties={this.props.eighties} calculateTotal={this.props.calculateTotal}/>
                </Grid.Column>
                </Grid.Row>
            </Grid>]
        } else if (this.props.numberOfBots === 1){
            playerContainer = [
                <Grid>
                    <Grid.Row>
                    <Grid.Column width={9}>
                        <PlayerHand hand={this.props.playerHand} bankAccount={this.props.bankAccount} calculateTotal={this.props.calculateTotal} checkIfBust={this.props.checkIfBust} message={this.props.message[1]} eighties={this.props.eighties} betAmount={this.props.betAmount}/>  
                        {this.renderButtons()}
                        
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Bot2Hand hand={this.props.bot1Hand} eighties={this.props.eighties} calculateTotal={this.props.calculateTotal}/>
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
            ]
        } else if (this.props.numberOfBots===0) {
        playerContainer = [
            <div>
                <PlayerHand hand={this.props.playerHand} bankAccount={this.props.bankAccount} calculateTotal={this.props.calculateTotal} checkIfBust={this.props.checkIfBust} message={this.props.message[1]} eighties={this.props.eighties} betAmount={this.props.betAmount}/> 
                {this.renderButtons()}
            </div>
            ]
        }
        return (
            // position: absolute; left: 50%; top: 50%;

            <div className={this.props.gameStarted}>

                <Container textAlign="center">
                    <DealerHand hand={this.props.dealerHand} calculateTotal={this.props.calculateTotal} userStayed={this.props.stayed} message={this.props.message[0]} eighties={this.props.eighties} botsStayed={this.props.botsStayed}/>
                </Container>
                    <Container textAlign="center">
                        {playerContainer}
                
                {/* <button onClick={this.props.handleHit} style={{display: this.props.stayed ? 'none' : 'inline'}}>Hit Me</button>
                <button onClick={this.props.handleStand} style={{display: this.props.stayed ? 'none' : 'inline'}}>Stand</button> */}
                <button className="button" style={{display: 'none'}}>Split</button>
                <h2 className="h2">{this.props.endGameMessage}</h2>
                <button className="button" onClick={this.props.handleNewRound} style={{display: this.props.botsStayed && this.props.calculateTotal(this.props.dealerHand) >= 17 && this.props.bankAccount >= 10  || this.props.numberOfBots === 0 && this.props.botsStayed && this.props.bankAccount >= 10 ? 'inline' : 'none'}}>New Round</button>
                <button className="button" style={{display: this.props.botsStayed && this.props.calculateTotal(this.props.dealerHand) >= 17 || this.props.numberOfBots === 0 && this.props.botsStayed ? 'inline' : 'none'}} onClick={this.props.walkAway}>Walk Away</button>

                </Container>

            </div>
        )
    }
}





//depending on props.num bots, we need to display bot hands, so there will be html there.
//in the later version, the plan is to figure out routes and rewire this so they're separate that way.

//I could render playerhand here and trim the tree down, but as players can have more than one hand and there needs to be logic,
//it makes sense to have a playercontainer instead containing that logic, to separate concerns.



