const teamsRepository = require('./repositories/teams');
const {WebClient} = require('@slack/web-api');

const onSetTargetChannel = (db, slackBotToken) => {
  return async (payload) => {
    const teamId = payload.team.id;

    teamsRepository
      .update(db, teamId, {channel: payload.actions[0].selected_channel})
      .catch(err => console.log(err));
  };
};

const appHomeHandler = slackBotToken => {
  return async event => {
    console.log(event);

    const web = new WebClient(process.env.SLACK_BOT_TOKEN);

    const block = {
      type: 'home',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*BRB Settings*',
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Hello you, we are here to do some setup! :gear:',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Choose the target channel',
          },
          accessory: {
            action_id: 'set_target_channel',
            type: 'channels_select',
            placeholder: {
              type: 'plain_text',
              text: 'Select channel',
            },
          },
        },
      ],
    };

    try {
      web.views.publish({user_id: event.user, view: block});
    } catch (e) {
      console.log(e);
    }
  };
};

module.exports = {
  registerEvents: (slackEvents, slackBotToken) => {
    slackEvents.on('app_home_opened', appHomeHandler(slackBotToken));
  },
  registerInteractions: (db, slackInteractions, slackBotToken) => {
    slackInteractions.action(
      {action_id: 'set_target_channel'},
      onSetTargetChannel(db, slackBotToken),
    );
  },
};
