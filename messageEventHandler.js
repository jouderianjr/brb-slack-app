const {WebClient} = require('@slack/web-api');

const usersRepository = require('./repositories/users');
const teamsRepository = require('./repositories/teams');
const {commands} = require('./config');

const isBackMessage = message => message.toLowerCase().includes('back');

const isValidCommand = message => {
  const lowerCaseMessage = message.toLowerCase();
  return commands.some(command => lowerCaseMessage.includes(command.tag));
};

const getEmoji = message => {
  const lowerCaseMessage = message.toLowerCase();
  return commands.find(command => lowerCaseMessage.includes(command.tag)).emoji;
};

const setStatus = (emoji, text, web) =>
  web.users.profile
    .set({
      profile: {
        status_text: text,
        status_emoji: emoji,
        status_expiration: 0,
      },
    })
    .then(resp => console.log(resp))
    .catch(err => console.log(err));

const messageHandler = db => {
  return async event => {
    try {
      console.log(event.team);
      console.log(event.user);

      const team = await teamsRepository.getById(db, event.team);

      const user = await usersRepository.getById(db, event.team, event.user);

      if (team.channel === event.channel) {
        const web = new WebClient(user && user.accessToken);

        if (isBackMessage(event.text)) {
          setStatus('', '', web);
        } else if (isValidCommand(event.text)) {
          const emoji = getEmoji(event.text);
          setStatus(emoji, event.text, web);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
};

module.exports = messageHandler;
