import React, { Component } from 'react'
// import { Container, Divider } from 'semantic-ui-react'

export default class DealerHand extends Component {
    
    renderCards=()=>{
        const neon = this.props.eighties ? "_neon" : ""
        const secondCard=this.props.hand[1]
        if (this.props.hand.length === 2 && this.props.calculateTotal(this.props.hand) !== 21 && this.props.botsStayed === false){
            return <img src={require(`../images/${secondCard.suit}${secondCard.value}${neon}.png`)} className={this.props.eighties ? "neonCard" : "card"}/>
        } else if (this.props.userStayed === true && this.props.botsStayed === true || this.props.calculateTotal(this.props.hand) === 21){
            return this.props.hand.map(cardObj => <img src={require(`../images/${cardObj.suit}${cardObj.value}${neon}.png`)} className={this.props.eighties ? "neonCard" : "card"}/>)
        }
    }



    render() {
        return (
            <div className={this.props.message != "" ? "dealerMessage" : "dealer"}>
            {/* <Container textAlign='center'> */}
                <img src={require(`../images/card_back${this.props.eighties ? "_neon" : ""}.png`)} className={this.props.eighties ? "neonCard" : "card"} style={{display: this.props.hand.length > 0 && this.props.hand.length <= 2 && this.props.botsStayed === false && this.props.calculateTotal(this.props.hand) !== 21 ? 'inline' : 'none',}}/>
                {this.renderCards()}
                <p>{this.props.message}</p>
            {/* </Container> */}
            </div>
        )
    }
}



//inexplicable bug: dealer stopped at total of 12
