const add = async (db, team) =>
  db
    .collection('teams')
    .doc(team.id)
    .set({
      id: team.id,
      name: team.name,
      channel: team.channel,
    })
    .then(data => {
      return {id: team.id, name: team.name, channel: team.channel};
    });

const getById = async (db, teamId) =>
  db
    .collection('teams')
    .doc(teamId)
    .get()
    .then(doc => (doc.empty ? null : doc.data()));

const update = async (db, teamId, fields) =>
  db
    .collection('teams')
    .doc(teamId)
    .update(fields);

module.exports = {
  add,
  getById,
  update,
};
