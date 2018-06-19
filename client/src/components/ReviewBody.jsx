import React from "react";
import StarRating from "react-star-rating-component";

const ReviewBody = (props) => {
  let months = {
    "01": "Jan", 
    "02": "Feb", 
    "03": "Mar", 
    "04": "Apr",
    "05": "May", 
    "06": "Jun", 
    "07": "Jul", 
    "08": "Aug",
    "09": "Sept", 
    "10": "Oct", 
    "11": "Nov", 
    "12": "Dec"
  };

  let [month, day, year] = props.date.split("/");
  let formatted = `${months[month]} ${day}, ${year}`;  
  
  return (
    <div className="review-content">
      <div className="review-head"><StarRating name="rating" value={props.rating} editing={false} /> <span className="date">{formatted}</span></div>
      <div className="review-body">{props.review}</div>
      <a className="link" href={`/${props.productId}/`}><img className="product-img" src={props.img}/><span className="product-name">{props.productName}</span></a>
    </div>
  )
}

export default ReviewBody;
