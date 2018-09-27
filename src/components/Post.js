import React, { Component } from 'react';
import './Post.css';

const Post = (props) => {
  return (
    <div className="post">
      <div className="post-upvotes">{props.upvotes}</div>
      <div className="post-info">
        <div className="post-title">
          {props.postTitle}
        </div>
        <div className="post-footer">
          <div className="post-subreddit">{props.subReddit}</div>
          <div className="post-user">posted by u/{props.userSubmitted}</div>
          <div className="post-comments">{props.numComments} comments</div>
          <div className="post-time">posted {props.timePosted}</div>
        </div>
      </div>
    </div>
  );
};

export default Post;