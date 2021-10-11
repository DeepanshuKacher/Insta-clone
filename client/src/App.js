import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import SignUp from "./components/screens/SignUp";
import Login from "./components/screens/Login";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

function App() {
  const [searchItems, setSearchItems] = useState();

  return (
    <Router>
      <Navbar setSearchItems={setSearchItems} searchItems={searchItems} />

      {searchItems && (
        <div className="search-result">
          <ul className="search-result-ul">
            {searchItems.users.map((item) => (
              <li key={item._id}>
                <Link
                  className="search-result-link"
                  to={
                    item._id === JSON.parse(localStorage.getItem("user"))._id
                      ? "/profile"
                      : `/profile/${item._id}`
                  }
                >
                  <img
                    alt="profilePic"
                    src={item.profilePic}
                    className="searchPic"
                  />
                  <h1 className="searchName">{item.name}</h1>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route exact path="/profile" component={Profile} />
        <Route path="/create" component={CreatePost} />
        <Route path="/profile/:userid" component={UserProfile} />
      </Switch>
    </Router>
  );
}

export default App;
