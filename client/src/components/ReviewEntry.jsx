import React from "react";
import ReviewUser from "./ReviewUser.jsx";
import ReviewBody from "./ReviewBody.jsx";
import Helpfulness from "./Helpfulness.jsx";

const ReviewEntry = (props) => {
  return (
    <div className="review-wrapper">
      <Helpfulness
        reviewId={props.data.id}
        votes={props.data.votes}
        helpfulness={props.data.helpfulness}
      />
      <ReviewUser 
        username={props.data.username} 
        img={props.data.avatar_url} 
      />
      <ReviewBody 
        rating={props.data.rating}
        date={props.data.date_submitted}
        review={props.data.review}
        img={props.data.img_url}
        productName={props.data.product}
        productId={props.data.img_url.slice(68, props.data.img_url.indexOf(".jpg"))}
      />
    </div>
  )
}

export default ReviewEntry;
