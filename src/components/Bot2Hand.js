import React, { Component } from 'react'
import { Container, Divider } from 'semantic-ui-react'

export default class Bot2Hand extends Component {
    renderCards = () => {
        const neon = this.props.eighties ? "_neon" : ""
        if (this.props.hand.length >= 1) {
            return this.props.hand.map(cardObj => <img src={require(`../images/${cardObj.suit}${cardObj.value}${neon}.png`)} className={this.props.eighties ? "neonCard" : "card"}/>)
        }
    }
    renderMessage = () => {
        let message
        if (this.props.calculateTotal(this.props.hand) > 21){
            message = `Wild Bill Hickock busted with ${this.props.calculateTotal(this.props.hand)}`
        } else {
            message = `Wild Bill Hickock's total is ${this.props.calculateTotal(this.props.hand)}`
        }
        return message
    }

    render() {
        return (
            <div className="player">

                    {this.renderCards()}
                    <p style={{display: this.props.hand.length >= 2 ? 'block' : 'none'}}>{this.renderMessage()}</p>
            </div>
        )
    }
}

