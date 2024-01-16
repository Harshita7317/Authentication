const express = require("express");
const app = express();
app.use(express.json());
const cookies = require("cookie-parser");
app.use(cookies());
const { connectDatabase } = require("./Connections/connections"); //for database connection
const generateToken = require("./tokens/generateToken");
const SIGNUP_MODELS = require("./models/Signup");

//Signup API
app.post("/signup", async (req, res) => {
  try {
    const signupdetails = {
      username: req.body.username,
      password: req.body.password,
      useremail: req.body.useremail,
    };
    console.log(signupdetails);

    const Signup = await SIGNUP_MODELS(signupdetails);
    await Signup.save();
    return res.json({ success: true, message: "data saved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: "error.message" });
  }
});

//Login API
app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const savepassword = await SIGNUP_MODELS.findOne({ password: password });
    if (savepassword) {
      const token = generateToken(username);
      console.log(token);
      res.cookie("web_tk", token);
      return res.json({
        success: true,
        message: "Logged In and Cookie generated successfully",
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

connectDatabase();
const PORT = 8000;
app.listen(PORT, async () => {
  await console.log("Server is running on port", PORT);
});
