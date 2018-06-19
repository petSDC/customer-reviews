import React from "react";

const ReviewUser = (props) => {
  return (
    <div className="user-wrapper">
      <img className="user-img" src={props.img} />
      <div className="username">Reviewed by<br />
        {props.username}
      </div>
    </div>
  )
}

export default ReviewUser;
