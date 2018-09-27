import React, { Component } from 'react';
import './App.css';
import Post from "./components/Post";
import moment from 'moment';
import humanFormat from 'human-format';

class App extends Component {
  state = {
    posts: [],
    after: '',
    before: ''
  };

  getInitAllFeed() {
    fetch('http://www.reddit.com/r/all/hot.json?count=25')
      .then(res => res.json())
      .then(data => {
        console.log('data', data);

        const { after, before } = data.data;

        // filter the large json object returned from reddit and only grab necessary info
        const upvotes = data.data.children.map(item => item.data.score);
        const titles = data.data.children.map(item => item.data.title);
        const subreddits = data.data.children.map(item => item.data.subreddit_name_prefixed);
        const users = data.data.children.map(item => item.data.author);
        const numComments = data.data.children.map(item => item.data.num_comments);
        const commentsLinks = data.data.children.map(item => item.data.permalink);
        const postUrls = data.data.children.map(item => item.data.url);
        const timesCreated = data.data.children.map(item => item.data.created);

        // check if post is a video, if so, get stream url
        const areVideos = data.data.children.map(item => item.data.is_video);
        const videoUrls = data.data.children.map(item => {
          if (item.data.is_video) return item.data.media.reddit_video.scrubber_media_url;
          else return '';
        });

        // create custom post object to hold filtered values
        const posts = [];

        for (let i=0; i<24; i++) {
          const post = {};
          post.upvotes = humanFormat(upvotes[i], { decimals: 1 });
          post.title = titles[i];
          post.subreddit = subreddits[i];
          post.user = users[i];
          post.numComments = numComments[i];
          post.commentLink = commentsLinks[i];
          post.url = postUrls[i];
          // use moment.js to calculate time diff, resulting str format: "1 hour", "5 hours", "3 days"
          post.created = moment.unix(timesCreated[i]).fromNow(true);

          post.isVideo = areVideos[i];
          post.videoUrl = videoUrls[i];

          // state var to see if post has been visited by user
          post.hasVisited = false;

          posts.push(post);
        }

        this.setState({ after: after, before: before, posts: posts });

      });
  }

  componentDidMount() {
    this.getInitAllFeed();
  }

  listPosts() {
    return this.state.posts.map((post, idx) => {
      return (
        <Post
          key={idx}
          postTitle={post.title}
          url={post.url}
          upvotes={post.upvotes}
          subReddit={post.subreddit}
          userSubmitted={post.user}
          numComments={post.numComments}
          commentsLink={post.commentLink}
          timePosted={post.created}
          isVideo={post.isVideo}
          videoUrl={post.videoUrl}
        />
      );
    });
  }

  render() {
    return (
      <div className="App">
        <h1>React Reddit Viewer</h1>
        <div className="active-subreddit-name">/r/all</div>

        {this.listPosts()}

      </div>
    );
  }
}

export default App;
