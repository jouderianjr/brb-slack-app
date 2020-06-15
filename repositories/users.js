const add = async (db, teamId, user) =>
  db
    .collection('teams')
    .doc(teamId)
    .collection('users')
    .doc(user.id)
    .set({
      id: user.id,
      accessToken: user.accessToken,
    })
    .then(data => {
      console.log(data);
      return {
        id: user.id,
        accessToken: user.accessToken,
      };
    });

const getById = async (db, teamId, userId) =>
  db
    .collection('teams')
    .doc(teamId)
    .collection('users')
    .doc(userId)
    .get()
    .then(doc => (doc.empty ? null : doc.data()));

module.exports = {
  add,
  getById,
};
