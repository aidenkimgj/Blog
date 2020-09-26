module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'user',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false,
      },

      admin : {
        type: DataTypes.STRING(3),
        allowNull : false
      },

      id : {
        type: DataTypes.STRING(30),
        allowNull : false
      },

      password: {
        type: DataTypes.STRING(100),
        allowNull : false
      },

      email: {
        type: DataTypes.STRING(40),
        allowNull : false,
        defaultValue : 0
      },

      signup_date: {
        type: DataTypes.DATE,
        allowNull : false
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false,
    }
)};