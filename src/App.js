import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>React Reddit Viewer</h1>
        <div className="active-subreddit-name">/r/all</div>

        <div className="post-container">
          <div className="post">
            <div className="post-upvotes">28.2k</div>
            <div className="post-info">
              <div className="post-title">
                Dunkin- the dog that flies over everything no matter how tall they are.
              </div>
              <div className="post-footer">
                <div className="post-subreddit">/r/aww</div>
                <div className="post-user">u/JoseTwitterFan</div>
                <div className="post-comments">282 comments</div>
                <div className="post-time">posted 2 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
