import React, { Component } from 'react';
import './App.css';
import Post from "./components/Post";

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

        // create custom post object to hold filtered values
        const posts = [];

        for (let i=0; i<24; i++) {
          const post = {};
          post.upvotes = upvotes[i];
          post.title = titles[i];
          post.subreddit = subreddits[i];
          post.user = users[i];
          post.numComments = numComments[i];
          post.commentLink = commentsLinks[i];
          post.url = postUrls[i];
          post.created = timesCreated[i];

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
          upvotes={post.upvotes}
          postTitle={post.title}
          subReddit={post.subreddit}
          userSubmitted={post.user}
          numComments={post.numComments}
          timePosted={post.created}
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
