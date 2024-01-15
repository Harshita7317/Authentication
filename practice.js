const express = require("express");
const app = express();
app.use(express.json());
const cookies = require("cookie-parser");
app.use(cookies());

const generateToken = require("./tokens/generateToken");
// const verifyToken = require("./tokens/verifyToken");

const users = []; //to store the userdata

app.post("/signup", (req, res) => {
  try {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    if (users.find((user) => user.username === username)) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    users.push({ username, password });
    return res.json({ success: true, message: "User signed up successfully" });
  } catch (error) {}
});

//Login api
app.post("/login", (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    //find user in the users array
    const user = users.find((user) => user.username === username);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "User doesn't exist" });
    }
    //to check password
    if (user.password === password) {
      const token = generateToken(username);
      console.log(token);
      res.cookie("web_tk", token);
      return res.json({
        success: true,
        message: "Cookie generated successfully",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Incorrect password" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

const PORT = 8000;
app.listen(PORT, async () => {
  await console.log("Server is running on port", PORT);
});
