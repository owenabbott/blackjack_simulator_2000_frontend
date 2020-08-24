import React, { Component } from 'react'

export default class Credits extends Component {
    render() {
        return (
            <div style={{display: this.props.credits ? "block" : "none"}}>

                    <p>Pixel playing cards made by Yaoman on itch.io
                    https://yaomon.itch.io/playing-cards</p>

                    <p>Neon mode playing cards made by mapsandapps on itch.io
                    https://mapsandapps.itch.io/synthwave-playing-card-deck-assets</p>

                    <p>Font 'pixelar' from fonts.com
                    https://www.fonts.com/font/graviton/pixelar</p>

                    <p>Normal mode music: 8 Bit Menu (By David Renda), Royalty free music from https://www.fesliyanstudios.com</p>

                    <p>Neon mode music: A Sad Touch (by John Børge Tjelta, also known as Arachno)
                    http://www.musikwave.com/artist/Arachno</p>

                    <p>General interface assets purchased from www.gamedevmarket.net</p>
            </div>
        )
    }
}
