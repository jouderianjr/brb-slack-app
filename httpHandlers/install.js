
function handler(clientId) {
  const url = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&user_scope=channels:history,chat:write,users.profile:write`;

  return async (req,res,next) => {
    res.send(
      `<a href=${url}><img alt=""Add to Slack"" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>`,
    );
  };
}

module.exports = handler;
