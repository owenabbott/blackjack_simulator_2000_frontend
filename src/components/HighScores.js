import React, { Component } from 'react'

export default class HighScores extends Component {
    //needs to fetch up the top ten users from the backend and display them here.
    constructor(props){
        super(props)
        this.state={
            highScores: ["none"],
            fetched: false
        }
    }
    
    toggleNewGame=()=>{
        this.setState({
            highScores: ["none"],
            fetched: false
        })
        this.props.playAgain()
    }
        
    

    fetchHighScores=()=>{
        if (this.props.displayTopWinners === true && this.state.fetched === false){
            fetch('https://blackjack-simulator-backend.herokuapp.com/users')
            .then(res=>res.json())
            .then(highScoresArr => {
            this.setState({
                highScores: highScoresArr,
                fetched: true})
            })
        }  
    }
    renderHighScores=()=>{
        return this.state.highScores.map(scoreObj => <><tr><td>{scoreObj.name}</td><td>{scoreObj.bank_account - 2000}</td></tr></>)
    }

    render() {
        return (
            <div style={{display: this.props.displayTopWinners ? 'block' : 'none', textAlign: "center"}}>
                <p style={{fontSize: "50px"}}>Big Winners</p>
                <table className="highScores">
                    <tr>
                        <th>Name</th>
                        <th>Winnings</th>
                    </tr>
                        {this.fetchHighScores()}
                        {this.renderHighScores()}
                        
                </table>
                <button className="button" onClick={this.toggleNewGame}>Play Again</button>
            </div>
        )
    }
}
