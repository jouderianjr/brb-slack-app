const axios = require('axios');
const teamsRepository = require('./../repositories/teams');
const usersRepository = require('./../repositories/users');

function handler(slackClientId, slackClientSecret, db) {
  return async (req, res, next) => {
    const url = `https://slack.com/api/oauth.v2.access?client_id=${slackClientId}&client_secret=${slackClientSecret}&code=${req.query.code}`;
    axios
      .get(url)
      .then(({data}) => {
        return teamsRepository
          .getById(db, data.team.id)
          .then(team => {
            if (team) {
              return team;
            } else {
              return teamsRepository.add(db, {
                id: data.team.id,
                name: data.team.name,
                channel: null,
              });
            }
          })
          .then(team => {
            const user = {
              id: data.authed_user.id,
              accessToken: data.authed_user.access_token,
            };

            return usersRepository.add(db, team.id, user);
          }) ;
      })
      .then(user => res.send('OK'))
      .catch(err => res.send(err));
  };
}

module.exports = handler;

