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

  try {
    const response = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
        redirect_uri: process.env.SLACK_REDIRECT_URI,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // console.log(response);
    
    if (response.data.ok) {
      // const { access_token } = response.data;
      // storage.setItemSync("slack_access_token", access_token);
      res.json({
        status: 200,
        msg: "User Authorized Successfully, Now You can use User Bot in your workspace",
      });
    } else {
      console.error("Error obtaining access token:", response.data.error);
      return null;
    }
  } catch (error) {
    console.error("Error obtaining access token:", error);
    return null;
  }
});
