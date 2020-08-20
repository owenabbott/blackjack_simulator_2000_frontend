//Since players can have multiple hands and this is determined by conditionals,
//I need to have a container determining what to render, rather than just rendering PlayerHand
//also this should take care of clutter and separate concerns.


import React, { Component } from 'react'
import PlayerHand from '../components/PlayerHand'

export default class PlayerContainer extends Component {

    render() {
        return (
            <div>
                <PlayerHand />
                {/* render split hand components here after passing through conditional. is this getting too bloated? */}
            </div>
        )
    }
}
