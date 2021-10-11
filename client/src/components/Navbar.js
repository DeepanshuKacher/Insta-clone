import React from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

function Navbar({ setSearchItems, searchItems }) {
  const history = useHistory();

  if (!localStorage.getItem("user")) {
    history.push("/login");
  }

  function renderList() {
    if (localStorage.getItem("user")) {
      return [
        <li key="search-bar" className="search-bar">
          {searchItems && (
            <button
              className=" clearSearchButton material-icons"
              onClick={clearSearch}
            >
              cancel
            </button>
          )}
          <input type="text" id="searchInput" onChange={searchIt} />
          <i
            className="material-icons"
            style={{
              color: "black",
              cursor: "pointer",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
            }}
          >
            search
          </i>
        </li>,
        <li className="li_parent" key="li_parent">
          <li>
            <Link to="/profile">Profile</Link>
          </li>

          <li>
            <Link to="/create">Create Post</Link>
          </li>

          <li>
            <button
              className="btn waves-effect waves-light #4527a0 red darken-3"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              LOGOUT
            </button>
          </li>
        </li>,
      ];
    } else {
      return [
        <li key="login">
          <Link to="/login">Login</Link>
        </li>,
        <li key="signup">
          <Link to="/signup">SignUp</Link>
        </li>,
      ];
    }
  }
  function searchIt(e) {
    e.preventDefault();
    if (e.target.value) {
      axios
        .post("http://localhost:5000/search-user", {
          query: e.target.value,
        })
        .then((result) => {
          if (result.data.users.length) {
            setSearchItems(result.data);
          }
        });
    } else {
      clearSearch();
    }
  }
  function clearSearch() {
    document.getElementById("searchInput").value = "";
    setSearchItems(null);
  }
  function showFun() {
    if (document.querySelector(".menu-Icons").innerText === "menu") {
      document.querySelector(".li_parent").style.display = "flex";
      document.querySelector(".menu-Icons").innerText = "close";
    } else {
      document.querySelector(".li_parent").style.display = "none";
      document.querySelector(".menu-Icons").innerText = "menu";
    }
  }
  return (
    <nav className="nav-bar">
      <Link to={localStorage.getItem("user") ? "/" : "/login"} className="logo">
        Instagram
      </Link>
      <ul>{renderList()}</ul>
      <button
        className="material-icons  menu-Icons"
        style={{
          color: "black",
        }}
        onClick={showFun}
      >
        menu
      </button>
    </nav>
  );
}

export default Navbar;
