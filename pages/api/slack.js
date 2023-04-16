// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require("@slack/web-api");

// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient(process.env.SLACK_MARTHA_CHAT_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.ERROR,
});

// ID of the channel you want to send the message to
const channelId = "C04PVTMS24Q";

async function sendMessage(username, blocks) {
  try {
    // Call the chat.postMessage method using the WebClient
    const result = await client.chat.postMessage({
      channel: channelId,
      blocks: blocks,
      username: username,
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = sendMessage;
