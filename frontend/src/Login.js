// chat-app/frontend/src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateInput } from "./frontendValidation";
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGIN_USER } from "./graphqlQueries/authQueries";

function Login() {
  const client = useApolloClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Setup mutation hook
  const [loginUser, { error }] = useMutation(LOGIN_USER);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateInput(username, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { data } = await loginUser({
        variables: { username, password },
      });

      if (data) {
        localStorage.setItem("token", data.loginUser.token);
        // After successful login, reset the Apollo Client store
        await client.resetStore();

        navigate("/dashboard"); // Or any other route you want to navigate to.
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Navigate to register view
  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={`input-group ${errors.username ? "error" : ""}`}>
          <label>
            User ID:
            <input
              type="text"
              name="userid"
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
              name="password"
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
        <input type="submit" value="Submit" />
      </form>
      {errorMessage && <p>{errorMessage}</p>}

      <p>You don't have an account?</p>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Login;
