import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import M from "materialize-css";
import firebase, { storage } from "../firebase/firebase";

function SignUp() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setprofilePic] = useState();

  function postDetail(e) {
    e.preventDefault();
    if (profilePic) {
      let storageBucketRef = storage
        .ref(`${name} ${email}/${"user_profile_pic"}`)
        .put(profilePic);

      storageBucketRef.on(
        "state_changed",
        (snapshot) => {},
        (error) => {},
        () => {
          storageBucketRef.snapshot.ref.getDownloadURL().then((downloadURL) => {
            const information = {
              name,
              password,
              email,
              profilePic: downloadURL,
            };

            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
              "sign-in-button",
              {
                size: "invisible",
                callback: (response) => {},
              }
            );

            const appVerifier = window.recaptchaVerifier;

            firebase
              .auth()
              .signInWithPhoneNumber(email, appVerifier)
              .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;

                const code = prompt("Entre OTP");
                confirmationResult
                  .confirm(code)
                  .then((result) => {
                    axios
                      .post("http://localhost:5000/signup", information)
                      .then((data) => {
                        M.toast({
                          html: data.data.message,
                          classes: "#00c853 green accent-4",
                        });

                        history.push("/login");
                      })
                      .catch((error) => {
                        M.toast({
                          html: error.response.data.error,
                          classes: "#ff1744 red accent-3",
                        });
                      });
                  })
                  .catch((error) => {});
              })
              .catch((error) => {
                console.log('otp didn"t send an error', error);
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
    <div className="mycard">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="+918516XXXXXX"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="file-field input-field">
          <div className="btn waves-effect waves-light #4527a0 deep-purple darken-3">
            <span>Upload Profile Pic</span>
            <input type="file" onChange={imageUpload} required />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light #4527a0 deep-purple darken-3"
          onClick={postDetail}
        >
          SignUp
        </button>
        <h5>
          <Link to="/login">Already have an account</Link>
        </h5>
      </div>
      <div id="sign-in-button"></div>
    </div>
  );
}

export default SignUp;
