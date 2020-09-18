module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'admin',
    {
      id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
      },

      user_id: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
      },

      password: {
      type: DataTypes.STRING(100),
      allowNull: false
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false,
    }
  );
}

