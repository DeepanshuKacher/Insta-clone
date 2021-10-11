import axios from "axios";
import React, { useEffect, useState } from "react";
import M from "materialize-css";
import { storage } from "../firebase/firebase";

function Profile() {
  const [data, setData] = useState();
  const [profilePic, setprofilePic] = useState();

  const axiosheader = axios.create({
    headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
  });

  useEffect(() => {
    if (localStorage.getItem("user")) {
      axiosheader
        .get(
          `http://localhost:5000/user/${
            JSON.parse(localStorage.getItem("user"))._id
          }`
        )
        .then((result) => {
          setData(result.data);
        });
    }
  });

  function deletePost(postId, name) {
    axiosheader
      .delete(`http://localhost:5000/deletepost/${postId}`)
      .then((result) => {
        // Create a reference to the file to delete
        var desertRef = storage.ref(
          `${JSON.parse(localStorage.getItem("user")).name} ${
            JSON.parse(localStorage.getItem("user")).PhoneNumber
          }/${name}`
        );

        // Delete the file
        desertRef.delete().catch((error) => {
          console.log("firebase delete image error", error);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (profilePic) {
      var desertRef = storage.ref(
        `${
          JSON.parse(localStorage.getItem("user")).email
        }/${"user_profile_pic"}`
      );

      // Delete the file
      desertRef
        .delete()
        .then(() => {
          // File deleted successfully
          let storageBucketRef = storage
            .ref(
              `${
                JSON.parse(localStorage.getItem("user")).email
              }/${"user_profile_pic"}`
            )
            .put(profilePic);

          storageBucketRef.on(
            "state_changed",
            (snapshot) => {},
            (error) => {},
            () => {
              storageBucketRef.snapshot.ref
                .getDownloadURL()
                .then((downloadURL) => {
                  axiosheader
                    .put("http://localhost:5000/updateprofilepic", {
                      profilePic: downloadURL,
                    })
                    .then((data) => {
                      /*  M.toast({
                  html: data.data.message,
                  classes: "#00c853 green accent-4",
                }); */
                      window.location.reload();
                      console.log(data);
                    })
                    .catch((error) => {
                      /*   M.toast({
                  html: error.response.data.error,
                  classes: "#ff1744 red accent-3",
                }); */

                      console.log(error);
                    });
                });
            }
          );
          // File deleted successfully
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log("firebase delete image error", error);
        });

      // line break
    }
  }, [profilePic, axiosheader]);
  function imageUpload(e) {
    const type = ["image/png", "image/jpeg"];
    let select = e.target.files[0];
    if (type.includes(select.type) && select) {
      setprofilePic(select);
    } else {
      M.toast({
        html: "Please upload an Image",
        classes: "#00c853 red accent-4",
      });
    }
  }
  return (
    <>
      {data ? (
        <div className="Main_profile">
          <div className="Main_profile_upperChild">
            <div className="profile_picture_div">
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                src={data.user.profilePic}
                alt="Profile Pic"
              />

              <div className="edit_profile_picture">
                <label className="edit_profile_picture_label">
                  Update Profile Pic
                  <input
                    style={{ display: "none" }}
                    type="file"
                    onChange={imageUpload}
                  />
                </label>
              </div>
            </div>
            <div>
              <h4>{JSON.parse(localStorage.getItem("user")).name}</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h5>{data.posts.length} posts</h5>
                <h5>{data.user.followers.length} followers</h5>
                <h5>{data.user.following.length} following</h5>
              </div>
            </div>
          </div>
          <div className="gallery">
            {data.posts.map((item) => {
              return (
                <div
                  className="imgDiv"
                  key={item._id}
                  style={{
                    backgroundImage: `url(${item.photo})`,
                  }}
                >
                  <button
                    style={{
                      border: "none",
                      outline: "none",
                      opacity: "0.4",
                      cursor: "pointer",
                    }}
                    onClick={() => deletePost(item._id, item.photo_name)}
                  >
                    <i className="material-icons">delete</i>
                  </button>
                </div>
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
