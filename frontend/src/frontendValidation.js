//TODO: use library

// frontendValidation.js
//TODO: change name
export const validateInput = (username, password) => {
  const errors = {};

  if (!username) {
    errors.username = "Username is required";
  } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
    errors.username = "Username can only contain letters and numbers";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password should be at least 8 characters";
  }

  return errors;
};

export const validateRegisterInput = (
  email,
  username,
  password,
  //TODO: change name
  password2,
  avatar
) => {
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email is invalid";
  }

  if (!username) {
    errors.username = "Username is required";
  } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
    errors.username = "Username can only contain letters and numbers";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password should be at least 8 characters";
  }

  if (password !== password2) {
    errors.password2 = "Passwords do not match";
  }

  return errors;
};

export const validateSearchInput = (searchInput) => {
  const errors = {};

  if (!searchInput) {
    errors.searchInput = "Search input is required";
  } else if (!/^[a-zA-Z0-9]+$/.test(searchInput)) {
    errors.searchInput = "Search input can only contain letters and numbers";
  }

  return errors;
};
