import React from "react";
import axios from "axios";

class Helpfulness extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
      votes: this.props.votes,
      helpfulness: this.props.helpfulness
    }
  }

  handleVote(id, votes, helpfulness, selected) {
    axios.put(`${window.location.pathname}reviews`, {
      id: id,
      votes: votes,
      helpfulness: helpfulness
    })
      .then(() => this.setState({
        selected: selected,
        votes: votes,
        helpfulness: helpfulness
      }))
      .catch(err => console.log(err));
  }

  render() {
    let selected = this.state.selected;
    let handleUpvoteClick;
    let handleDownvoteClick;
    let numStyle;

    if (selected === "upvote") {
      handleUpvoteClick = () => this.handleVote(this.props.reviewId, this.state.votes - 1, this.state.helpfulness - 1, null)
      handleDownvoteClick = () => this.handleVote(this.props.reviewId, this.state.votes, this.state.helpfulness - 2, "downvote")
      numStyle = "#FF8b60";
    } else if (selected === "downvote") {
      handleUpvoteClick = () => this.handleVote(this.props.reviewId, this.state.votes, this.state.helpfulness + 2, "upvote")
      handleDownvoteClick = () => this.handleVote(this.props.reviewId, this.state.votes - 1, this.state.helpfulness + 1, null)
      numStyle = "#9494FF";
    } else {
      handleUpvoteClick = () => this.handleVote(this.props.reviewId, this.state.votes + 1, this.state.helpfulness + 1, "upvote")
      handleDownvoteClick = () => this.handleVote(this.props.reviewId, this.state.votes + 1, this.state.helpfulness - 1, "downvote")
      numStyle = "black";
    }

    return (
      <div className="helpfulness-wrapper">
        <div className="centered">
          <i 
            className="fas fa-arrow-up" 
            style={
              this.state.selected === "upvote" 
              ? {color: "#FF8b60"} 
              : {color: "black"}
            }
            onClick={handleUpvoteClick}
          />
        </div>
        <div className="centered" style={{color: numStyle}}>{this.state.helpfulness}</div>
        <div className="centered">
          <i 
            className="fas fa-arrow-down"
            style={
              this.state.selected === "downvote" 
              ? {color: "#9494FF"} 
              : {color: "black"}
            }
            onClick={handleDownvoteClick}
          />
        </div>
      </div>
    )
  }
}

export default Helpfulness;
