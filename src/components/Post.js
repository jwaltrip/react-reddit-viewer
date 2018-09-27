import React, { Component } from 'react';
import './Post.css';

const Post = (props) => {
  // calculate which url should be the post url
  let url = props.url;
  if (props.isVideo) {
    url = props.videoUrl;
  }

  return (
    <div className="post">
      <div className="post-upvotes">{props.upvotes}</div>
      <div className="post-info">
        <a href={url} target="_blank">
          <div className="post-title">
            {props.postTitle}
          </div>
        </a>
        <div className="post-footer">
          <div className="post-subreddit">{props.subReddit}</div>
          <div className="post-user">posted by u/{props.userSubmitted}</div>
          <div className="post-comments">{props.numComments} comments</div>
          <div className="post-time">posted {props.timePosted} ago</div>
        </div>
      </div>
    </div>
  );
};

export default Post;