import React, { Component } from 'react'

export default class BetForm extends Component {
    render() {
        return (
            <div className={this.props.display ? "test" : "none"}>
            
                <form onSubmit={this.props.handleBet} className="place_bet_form">
                <label>Enter your bet</label><br></br>
                <input type="number" id="bet_amount" name="bet_amount" defaultValue="20" className="button" /><br></br>
                <label>How many players are at the table</label>
                <select name="bots" id="bots" className="button">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select><br></br>
                <input type="submit" className="button" />
                </form>
                {this.props.warningMessage}
            </div>
            
        )
    }
}

// style={{display: this.props.display, margin: 'auto', padding: "23%", width: "50%", height: '50%'}