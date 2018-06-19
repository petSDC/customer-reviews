import React from "react";
import axios from "axios";
import StarRating from "react-star-rating-component";

class SubmitReview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputName: "",
      inputReview: "",
      rating: 1
    }
  }

  createDate() {
    let d = new Date();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let year = d.getFullYear();

    month < 10 ? month = "0" + month : null;

    return `${month}/${day}/${year}`;
  }

  onStarClick(nextValue) {
    this.setState({rating: nextValue});
  }

  postReview(name, review, rating) {
    let date = this.createDate();

    axios.post(`${window.location.pathname}reviews`, {
      username: name,
      dateSubmitted: date,
      rating: rating,
      review: review,
      shopId: this.props.shopId
    })
      .then(() => {
        this.props.getReviews();
      })
      .catch(err => console.log(err));
  }
  
  render() {
    return (
      <div>
        <h4 className="review-title">Leave a Review</h4>
        <form className="form">
          <div>
            <StarRating
              className="submit-rating" 
              name="rating"
              starCount={5}
              value={this.state.rating}
              onStarClick={this.onStarClick.bind(this)}
            />
          </div>
          <div>
            <input
              className="name"
              type="text"
              name="name"
              placeholder="Name"
              onChange={e => this.setState({inputName: e.target.value})}
            />
          </div>
          <div>
            <textarea
              className="review-txt" 
              placeholder="Your review here..."
              onChange={e => this.setState({inputReview: e.target.value})}
            />
          </div>
          <button 
            onClick={e => {
              e.preventDefault();
              this.postReview(this.state.inputName, this.state.inputReview, this.state.rating);
            }}
            className="submit-btn"
          >Submit Review!</button>
        </form>
      </div>
    )
  }
}

export default SubmitReview;
