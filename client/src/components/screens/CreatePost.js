import React, { useState } from "react";
import { storage } from "../firebase/firebase";
import M from "materialize-css";
import axios from "axios";
import { useHistory } from "react-router-dom";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState();

  const history = useHistory();

  function imageUpload(e) {
    const type = ["image/png", "image/jpeg"];
    let select = e.target.files[0];
    if (type.includes(select.type) && select) {
      setImage(select);
    } else {
      M.toast({
        html: "Please upload an Image",
        classes: "#00c853 red accent-4",
      });
    }
  }
  function postDetail(e) {
    e.preventDefault();
    if (image) {
      let storageBucketRef = storage
        .ref(
          `${JSON.parse(localStorage.getItem("user")).name} ${
            JSON.parse(localStorage.getItem("user")).PhoneNumber
          }/${image.name}`
        )
        .put(image);

      storageBucketRef.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          storageBucketRef.snapshot.ref.getDownloadURL().then((downloadURL) => {
            const sendingData = {
              title,
              body,
              picUrl: downloadURL,
              photo_name: image.name,
            };
            const authAxios = axios.create({
              headers: {
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            });

            authAxios
              .post("http://localhost:5000/createpost", sendingData)
              .then((data) => {
                M.toast({
                  html: data.data,
                  classes: "#00c853 green accent-4",
                });
                history.push("/");
              })
              .catch((error) => {
                console.log(error.response);
              });
          });
        }
      );
    } else {
      M.toast({
        html: "Please upload an Image",
        classes: "#00c853 red accent-4",
      });
    }
  }

  return (
    <div
      className="card input-field"
      style={{
        margin: "10px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <input
        type="text"
        placeholder="body"
        onChange={(e) => setBody(e.target.value)}
        value={body}
      />
      <form>
        <div className="file-field input-field">
          <div className="btn waves-effect waves-light #4527a0 deep-purple darken-3">
            <span>Upload Image</span>
            <input type="file" onChange={imageUpload} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light #4527a0 deep-purple darken-3"
          onClick={postDetail}
        >
          Submit post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
