'use strict';

const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'db.json'))[
  env
];

const db = {};

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
  {
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  }
);

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  db.sequelize
  .authenticate()
  .then(() => {
      console.log('Connection has been established successfully.');
  })
  .catch(err => {
      console.log('Unable to connect to the database: ', err);
  });

  db.Admin = require('./admin')(sequelize, Sequelize);
  db.Board = require('./board')(sequelize, Sequelize);
  db.Category = require('./category')(sequelize, Sequelize);
  db.User = require('./user')(sequelize, Sequelize);
  db.Like = require('./like')(sequelize, Sequelize);
  db.Reply = require('./reply')(sequelize, Sequelize);

  db.Category.hasMany(db.Board, {
    foreignKey: 'cat_id',
    sourceKey: 'id'
  });
  
  db.Board.belongsTo(db.Category, {
    foreignKey: 'cat_id',
    targetKey: 'id'
  });

  db.User.hasMany(db.Reply, {
    foreignKey: 'user_id',
    sourceKey: 'user_id'
  });

  db.Reply.belongsTo(db.User, {
    foreignKey: 'user_id',
    targetKey: 'user_id'
  });

  db.Board.belongsToMany(db.User, {
    through: 'like',
    foreignKey: 'board_id'
  });

  db.User.belongsToMany(db.Board, {
    through: 'like',
    foreignKey: 'user_id'
  });

  

db.secret = '(9*)5$&!3%^0%^@@2$1!#5@2!4';
module.exports = db

