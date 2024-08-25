"use strict";
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    server.address().port,
    app.settings.env
  );
});

// **Consider using a more robust database solution for production!**
// const storage = require("node-persist");
// storage.init({
//   logging: true,
// });


app.get("/auth", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({
      status: 400,
      msg: "Authorization code is missing. Please try again.",
    });
  }

  try {
    const response = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      `client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.SLACK_REDIRECT_URI}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data.ok) {
      res.json({
        status: 200,
        msg: "User Authorized Successfully. You can now use the bot in your workspace.",
      });
    } else {
      console.error("Error obtaining access token:", response.data.error);
      res.status(500).json({
        status: 500,
        msg: "Failed to obtain access token. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Error obtaining access token:", error);
    res.status(500).json({
      status: 500,
      msg: "An error occurred while processing your request. Please try again later.",
    });
  }
});