import React, { Component } from 'react'

export default class PlayerHand extends Component {
    renderCards = () => {
        const neon = this.props.eighties ? "_neon" : ""
        return this.props.hand.map(cardObj => <img src={require(`../images/${cardObj.suit}${cardObj.value}${neon}.png`)} className={this.props.eighties ? "neonCard" : "card"} />)
    }
    render() {
        return (
            <div className="player">
                
                {this.renderCards()}
                
                <p style={{display: this.props.hand.length >=2 ? 'block':'none'}}>
                    {this.props.message}<br></br>
                    {/* Your bet is ${this.props.betAmount}<br></br>
                    You have ${this.props.bankAccount} */}
                </p>

            </div>
        )
    }
}
