// chat-app/frontend/src/components/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateRegisterInput } from "./frontendValidation";
import { useMutation, useApolloClient } from "@apollo/client";
import { REGISTER_USER } from "./graphqlQueries/authQueries";

function Register() {
  const client = useApolloClient();
  //TODO: manage state with redux toolkit
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [avatar, setAvatar] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Setup mutation hook
  const [registerUser, { error }] = useMutation(REGISTER_USER);

  const handleSubmit = async (event) => {
    event.preventDefault();

    //TODO: Redux saga to validate and make requests
    const validationErrors = validateRegisterInput(
      email,
      username,
      password,
      //TODO: change name
      password2,
      avatar
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // This replaces the fetch logic
    try {
      const { data } = await registerUser({
        variables: { email, username, password, avatar },
      });

      if (data) {
        localStorage.setItem("token", data.registerUser.token);
        // After successful register, reset the Apollo Client store
        await client.resetStore();
        navigate("/dashboard"); // Or any other route you want to navigate to.
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={`input-group ${errors.email ? "error" : ""}`}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({});
              }}
            />
          </label>
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className={`input-group ${errors.username ? "error" : ""}`}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors({});
              }}
            />
          </label>
          {errors.username && (
            <span className="error-message">{errors.username}</span>
          )}
        </div>

        <div className={`input-group ${errors.password ? "error" : ""}`}>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({});
              }}
            />
          </label>
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        <div className={`input-group ${errors.password2 ? "error" : ""}`}>
          <label>
            Confirm Password:
            <input
              type="password"
              value={password2}
              onChange={(e) => {
                setPassword2(e.target.value);
                setErrors({});
              }}
            />
          </label>
          {errors.password2 && (
            <span className="error-message">{errors.password2}</span>
          )}
        </div>

        <div className={`input-group ${errors.avatar ? "error" : ""}`}>
          <label>
            Avatar:
            <input
              type="text"
              value={avatar}
              onChange={(e) => {
                setAvatar(e.target.value);
                setErrors({});
              }}
            />
          </label>
          {errors.avatar && (
            <span className="error-message">{errors.avatar}</span>
          )}
        </div>

        <input type="submit" value="Register" />
      </form>

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default Register;
