const express = require("express");
const app = express();
app.use(express.json());
const cookies = require("cookie-parser");
app.use(cookies());

const generateToken = require("./tokens/generateToken");
const verifyToken = require("./tokens/verifyToken");

app.get("/public", (req, res) => {
  try {
    return res.json({ success: true, message: "Hello from Harshita" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post("/login", (req, res) => {
  try {
    console.log(req.body);
    let userid = req.body.userid;
    if (req.body.password == 12345) {
      const token = generateToken(userid);
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

const middleware = (req, res, next) => {
  if (verifyToken(req.cookies.web_tk)) {
    const userinfo = verifyToken(req.cookies.web_tk);
    console.log(userinfo);
    next();
  } else {
    return res.status(400).json({ success: false, error: "Unauthorized" });
  }
};

app.get("/profile", middleware, (req, res) => {
  try {
    // if (
    //   req.cookies.web_tk ===
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OSIsImlhdCI6MTcwNTMzNDI3NCwiZXhwIjoxNzA1NDIwNjc0fQ.EvL-zMKs0CI3MVs3KppYBP4Qaf6YcJLQIx1cxQufrD0"
    // ) {
    return res.json({ success: true, message: "This is your profile" });
    // } else {
    //   return res
    //     .status(400)
    //     .json({ success: false, error: "Cookie did not match" });
    // }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get("/chats", middleware, (req, res) => {
  try {
    return res.json({ success: true, message: "This is your chats" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

//My feed
app.get("/feed", middleware, (req, res) => {
  try {
    return res.json({ success: true, message: "This is your feed" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

const PORT = 8000;
app.listen(PORT, async () => {
  await console.log("Server is running on port", PORT);
});
