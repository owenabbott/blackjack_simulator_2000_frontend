import React, { Component } from 'react'

export default class Header extends Component {
    populateHeader=()=>{
        return this.props.eighties ? <>Blackjack Simulator: Neon Nites</> : <>BlackJack Simulator 2000 </>
    }
    render() {
        return (  
            <header className={this.props.eighties ? "headerNeon" : "header"}>
                <h1>
                    {this.populateHeader()}
                </h1>
            </header>

        )
    }
}
