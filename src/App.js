import React, { Component } from 'react';
import './App.css';
import Post from "./components/Post";
import moment from 'moment';
import humanFormat from 'human-format';
import Scroll from 'react-scroll';
import Footer from "./components/Footer";

class App extends Component {
  state = {
    posts: [],
    after: '',
    before: '',
    currPage: 1
  };

  componentDidMount() {
    this.getInitAllFeed();
  }

  generateSlimPost(data) {
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

    for (let i = 0; i < 24; i++) {
      const post = {};
      post.upvotes = humanFormat(upvotes[i], {decimals: 1});
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

    return posts;
  }

  getInitAllFeed() {
    fetch('https://www.reddit.com/r/all/hot.json?count=25')
      .then(res => res.json())
      .then(data => {
        console.log('data', data);
        const {after, before} = data.data;
        const posts = this.generateSlimPost(data);

        this.setState({after: after, before: before, posts: posts});
      });
  }

  getNextPage() {
    fetch(`https://www.reddit.com/r/all/hot.json?after=${this.state.after}`)
      .then(res => res.json())
      .then(data => {
        console.log('data', data);
        const {after, before} = data.data;
        const posts = this.generateSlimPost(data);

        this.setState({after: after, before: before, posts: posts, currPage: this.state.currPage+1 });

        this.scrollToTop();
      });
  }

  getPrevPage() {
    fetch(`https://www.reddit.com/r/all/hot.json?before=${this.state.before}`)
      .then(res => res.json())
      .then(data => {
        console.log('data', data);
        const {after, before} = data.data;
        const posts = this.generateSlimPost(data);

        this.setState({after: after, before: before, posts: posts, currPage: this.state.currPage-1 });

        this.scrollToTop();
      });
  }

  scrollToTop() {
    const scroll = Scroll.animateScroll;
    scroll.scrollToTop();
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

        <div className="post-container">
          <div className="active-subreddit-name">/r/all - page {this.state.currPage}</div>

          {this.listPosts()}

          <div className="pagination-container">
            <button className="pagination-btn" onClick={this.getPrevPage.bind(this)}>Prev</button>
            {this.state.currPage}
            <button className="pagination-btn" onClick={this.getNextPage.bind(this)}>Next</button>
          </div>
        </div>

        <Footer/>

      </div>
    );
  }
}

export default App;
