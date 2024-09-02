const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema({
  userAccessToken: {
    type: String,
    required: true, 
  },
  botAccessToken: {
    type: String,
    required: true,
  },
  botId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  teamId: {
    type: String,
    required: true,
  },
});

const workspace = new mongoose.model("workSpace", workspaceSchema);

module.exports = workspace;
