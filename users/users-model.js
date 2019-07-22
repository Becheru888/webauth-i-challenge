const db = require('../database/dbConfig.js');

module.exports = {
    add,
    find
  };

  function find() {
    return db('users').select('id', 'username', 'password');
  }

  function add(user) {
    return db('users')
      .insert(user, 'id')
      .then(ids => {
        const [id] = ids;
        return findById(id);
      });
  }