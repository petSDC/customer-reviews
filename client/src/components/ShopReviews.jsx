import React from "react";
import axios from "axios";
import StarRating from "react-star-rating-component";
import ReviewEntry from "./ReviewEntry.jsx";
import SubmitReview from "./SubmitReview.jsx";

class ShopReviews extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reviews: [],
      avgRating: null,
      shopId: null,
      page: 1,
      lastPage: null,
      sortBy: "default"
    }
  }

  componentDidMount() {
    this.getReviews();
  }
  
  getReviews() {
    axios.get(`${window.location.pathname}reviews`)
      .then(response => {
        let reviews = response.data;
        let count = reviews.length;
        let avgRating = reviews.reduce((acc, val) => {
          return acc + val.rating;
        }, 0) / count;
        let shopId = reviews[0].shop_id;
        let lastPage;

        count % 5 === 0 
        ? lastPage = count / 5 
        : lastPage = Math.ceil(count / 5);

        this.setState({
          reviews: reviews, 
          avgRating: Math.round(avgRating), 
          shopId: shopId,
          lastPage: lastPage
        });
      })
      .catch(err => console.log(err));
  }

  handleBackArrow() {
    this.state.page === 1 
    ? null 
    : this.setState(prevState => {
      return {page: prevState.page - 1};
    });
  }

  handleForwardArrow() {
    this.state.page === this.state.lastPage 
    ? null 
    : this.setState(prevState => {
      return {page: prevState.page + 1};
    });
  }

  handleSelectSort(sort) {
    this.setState({page: 1, sortBy: sort});
  }

  render() {
    let reviews = this.state.reviews;
    let sort = this.state.sortBy;
    if (sort === "helpfulness") {
      let temp = reviews.slice();
      temp.sort((a, b) => {
        return b.helpfulness - a.helpfulness; 
      });
      reviews = temp;
    }
    if (sort === "descendingRating") {
      let temp = reviews.slice();
      temp.sort((a, b) => {
        if (a.rating !== b.rating) {
          return b.rating - a.rating;
        }
        return b.helpfulness - a.helpfulness;
      });
      reviews = temp;
    }
    if (sort === "ascendingRating") {
      let temp = reviews.slice();
      temp.sort((a, b) => {
        if (a.rating !== b.rating) {
          return a.rating - b.rating;
        }
        return b.helpfulness - a.helpfulness;
      });
      reviews = temp;
    }
    let page = this.state.page;
    let reviewIdxs = [0 + ((page - 1) * 5), 5 + ((page - 1) * 5)];
    let toRender = reviews.slice(reviewIdxs[0], reviewIdxs[1]);

    return (
      <section className="wrapper">
        <h4>
          Reviews
          <StarRating 
            name="avgRating" 
            value={this.state.avgRating} 
            editing={false}
            className="rating"
          /> 
          <span className="count">({this.state.reviews.length})</span>
        </h4>
        <div>
          <span className="page">Page</span>
          <i 
            className="fas fa-caret-left icon"
            style={page === 1 ? {color: "#D3D3D3"} : {color: "black"}}
            onClick={() => this.handleBackArrow()}
          />
            {page}
          <i 
            className="fas fa fa-caret-right icon" 
            style={page === this.state.lastPage ? {color: "#D3D3D3"} : {color: "black"}}
            onClick={() => this.handleForwardArrow()}
          />
          <span className="sort">Sort by</span>
          <select 
            onChange={e => this.handleSelectSort(e.target.value)}
            className="select"
          >
            <option value="default">None</option>
            <option value="helpfulness">Helpfulness</option>
            <option value="descendingRating">Rating: High to Low</option>
            <option value="ascendingRating">Rating: Low to High</option>
          </select>
        </div>
        {toRender.map(review => <ReviewEntry data={review} key={review.id}/>)}
        <div>
          <span className="page">Page</span>
          <i 
            className="fas fa-caret-left icon"
            style={page === 1 ? {color: "#D3D3D3"} : {color: "black"}}
            onClick={() => this.handleBackArrow()}
          />
            {page}
          <i 
            className="fas fa fa-caret-right icon" 
            style={page === this.state.lastPage ? {color: "#D3D3D3"} : {color: "black"}}
            onClick={() => this.handleForwardArrow()}
          />
        </div>
        <SubmitReview 
          getReviews={this.getReviews.bind(this)} 
          shopId={this.state.shopId}
        />
      </section>
    )
  }
}

export default ShopReviews;
