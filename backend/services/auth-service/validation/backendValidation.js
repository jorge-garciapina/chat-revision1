const validateInput = (req, res, next) => {
  const { username, password } = req.body;

  if (
    !username ||
    typeof username !== "string" ||
    !/^[a-zA-Z0-9]+$/.test(username)
  ) {
    return res.status(400).json({ error: "Invalid username format" });
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "Invalid password format" });
  }

  next();
};

module.exports = validateInput;
