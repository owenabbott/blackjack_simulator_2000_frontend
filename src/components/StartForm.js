import React, { Component } from 'react'
import '../App.css';


export default class StartForm extends Component {

    render() {
        return (
            <div className={this.props.initiated === true ? "none" : "test"}>
                <form onSubmit={this.props.handleStartFormSubmit} >
                <label>Your name?</label><br></br>
                <input type="text" id="name" name="name" className="button" /><br></br>
                <input type="submit" id="create_user" className="button"/>
            </form>

            {this.props.warningMessage}
          </div>
        )
    }
}


// margin: auto;
// padding: 15%;
// width: 5%;
// color: red;
// display: flex;



// display: "flex",
//           justifyContent: "center",
//           alignItems: "center"





// import React from "react";

// class NewPoemForm extends React.Component {
//   constructor(props){
//     super(props)
//     this.state={
//       title: '',
//       author: '',
//       content: ''
//     }
//   }

//   handleChange = (e) => {
//     this.setState({
//       [e.target.name]: e.target.value
//     })
//   }

//   handleFormSubmit = (e) => {
//     e.preventDefault()
//     this.props.createNewPoem(this.state)
//     e.target.reset()
//   }

//   render() {
//     return (
//       <form onSubmit={this.handleFormSubmit} className="new-poem-form">
//         <input placeholder="Title" name="title" onChange={this.handleChange}/>
//         <input placeholder="Author" name="author" onChange={this.handleChange}/>
//         <textarea placeholder="Write your masterpiece here..." rows={10} name="content" onChange={this.handleChange}/>
//         <input type="submit" value="Share your masterpiece" />
//       </form>
//     );
//   }
// }

// export default NewPoemForm;
