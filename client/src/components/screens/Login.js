import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";
import firebase from "../firebase/firebase";

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passPlaceholder, setPassPlace] = useState("Enter Your Password");

  function PostDate() {
    const information = { password, email };
    axios
      .post("http://localhost:5000/signin", information)
      .then((data) => {
        M.toast({
          html: "sign-in successfully",
          classes: "#00c853 green accent-4",
        });
        localStorage.setItem("jwt", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.savedUser));
        window.location = "/";
      })
      .catch((error) => {
        M.toast({
          html: error.response.data.error,
          classes: "#ff1744 red accent-3",
        });
      });
  }

  function PassReset() {
    if (!email) {
      alert("Enter Mobile Number");
    }

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("captcha is resolved");
        },
      }
    );

    const appVerifier = window.recaptchaVerifier;

    firebase
      .auth()
      .signInWithPhoneNumber(email, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;

        console.log("Otp is send to mobile number");

        const code = prompt("Entre OTP");
        confirmationResult
          .confirm(code)
          .then((result) => {
            document.getElementById("Enter_Number").disabled = true;
            document.getElementById("Enter_Number").style.cursor =
              "not-allowed";
            setPassPlace("Enter Your New Password");
          })
          .catch((error) => {
            // User couldn't sign in (bad verification code?)
            console.log("enter otp error ", error);
            // ...
          });

        // ...
      })
      .catch((error) => {
        // Error; SMS not sent

        console.log('otp didn"t send an error', error);
        // ...
      });
  }
  function sendNewPass() {
    axios
      .post("http://localhost:5000/resetPassword", {
        NewPassword: password,
        PhoneNumber: email,
      })
      .then((data) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log("There is an error", error);
      });
  }
  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input
          id="Enter_Number"
          type="text"
          placeholder="Enter your phone Number +918516XXXXXX"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder={passPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #4527a0 deep-purple darken-3"
          onClick={() => PostDate()}
        >
          Login
        </button>
        {passPlaceholder === "Enter Your Password" ? (
          <button
            style={{ marginLeft: "10px" }}
            className="btn waves-effect waves-light #4527a0 deep-purple darken-3"
            onClick={() => PassReset()}
          >
            Forget Password
          </button>
        ) : (
          <button
            style={{ marginLeft: "10px" }}
            className="btn waves-effect waves-light #4527a0 deep-purple darken-3"
            onClick={sendNewPass}
          >
            Enter Your New Password
          </button>
        )}

        <h5>
          <Link to="/signup">Don't have an account ?</Link>
        </h5>
      </div>
      <div id="sign-in-button" style={{ display: "none" }}></div>
    </div>
  );
}

export default Login;
