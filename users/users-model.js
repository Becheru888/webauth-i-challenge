const db = require('../database/dbConfig.js');

module.exports = {
    add,
    find,
    findBy,
    findById
  };

  function find() {
    return db('users').select('id', 'username', 'password');
  }

  
  function findBy(username) {
    return db('users').where(username);
  }

  function add(user) {
    return db('users')
      .insert(user, 'id')
      .then(ids => {
        const [id] = ids;
        return findById(id);
      });
  }

  function findById(id) {
    return db('users')
      .where({ id })
      .first();
  }