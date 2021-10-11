import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Profile() {
  const [userInfo, setUserInfo] = useState();
  const [change, setChange] = useState(0);
  const { userid } = useParams();

  let axiosheader = axios.create({
    headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
  });

  useEffect(() => {
    axiosheader.get(`http://localhost:5000/user/${userid}`).then((data) => {
      setUserInfo(data.data);
    });
  }, [change, axiosheader, userid]);

  function folloUser() {
    axiosheader
      .put("http://localhost:5000/follow", { followId: userid })
      .then((result) => {
        setChange((it) => it + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function unfollow() {
    axiosheader
      .put("http://localhost:5000/unfollow", { followId: userid })
      .then((result) => {
        setChange((it) => it + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      {userInfo ? (
        <div style={{ maxWidth: "80%", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={userInfo.user.profilePic}
                alt="Profile Pic"
              />
            </div>
            <div>
              <h4>{userInfo.user.name}</h4>
              {/* <h5>{userInfo.user.email}</h5> */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h5> {userInfo.posts.length} posts</h5>
                <h5>{userInfo.user.followers.length} followers</h5>
                <h5>{userInfo.user.following.length} following</h5>
              </div>
              {userInfo.user.followers.includes(
                JSON.parse(localStorage.getItem("user"))._id
              ) ? (
                <button
                  className="btn waves-effect waves-light #4527a0 deep-purple darken-3"
                  onClick={() => unfollow()}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="btn waves-effect waves-light #4527a0 deep-purple darken-3"
                  onClick={() => folloUser()}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userInfo.posts.map((item) => {
              return (
                <div
                  className="imgDiv"
                  key={item._id}
                  style={{
                    backgroundImage: `url(${item.photo})`,
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      ) : (
        <h4 style={{ position: "fixed", top: "50%", left: "50%" }}>
          loading...
        </h4>
      )}
    </>
  );
}

export default Profile;
