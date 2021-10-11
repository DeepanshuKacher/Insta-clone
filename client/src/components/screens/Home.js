import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

function Home() {
  const [data, setData] = useState([]);

  const axiosheader = axios.create({
    headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
  });

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      axiosheader.get("http://localhost:5000/allpost").then((data) => {
        setData(data.data);
      });
    }
  }, [axiosheader]);

  function likePost(id) {
    const senData = {
      postId: id,
    };
    axiosheader
      .put("http://localhost:5000/like", senData)
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result.data._id) {
            return result.data;
          } else {
            return item;
          }
        });

        setData(newData);
      })
      .catch((error) => {
        console.log("This is error ", error);
      });
  }
  function unlikePost(id) {
    const senData = {
      postId: id,
    };
    axiosheader
      .put("http://localhost:5000/unlike", senData)
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result.data._id) {
            return result.data;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((error) => {
        console.log("This is error ", error);
      });
  }

  function makeComment(text, postId) {
    const sendComment = {
      text,
      postId,
    };
    axiosheader
      .put("http://localhost:5000/comment", sendComment)
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result.data._id) {
            return result.data;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5>
              <Link
                to={
                  item.postBy._id ===
                  JSON.parse(localStorage.getItem("user"))._id
                    ? "/profile"
                    : `/profile/${item.postBy._id}`
                }
              >
                {item.postBy.name}
              </Link>
            </h5>
            <div className="card-image">
              <img src={item.photo} alt={item.title} />
              <div className="card-content">
                <i className="material-icons" style={{ color: "red" }}>
                  favorite
                </i>
                {item.likes.includes(
                  JSON.parse(localStorage.getItem("user"))._id
                ) ? (
                  <i
                    className="material-icons"
                    onClick={() => unlikePost(item._id)}
                  >
                    thumb_down
                  </i>
                ) : (
                  <i
                    className="material-icons"
                    onClick={() => likePost(item._id)}
                  >
                    thumb_up
                  </i>
                )}

                <h6>{item.likes.length} likes</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {item.comments.map((record) => {
                  return (
                    <h6 key={record._id}>
                      <span style={{ fontWeight: "500" }}>
                        {record.postBy.name}
                      </span>
                      {" " + record.text}
                    </h6>
                  );
                })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, item._id);
                    e.target[0].value = "";
                  }}
                >
                  <input type="text" placeholder="add a comment" />
                </form>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
