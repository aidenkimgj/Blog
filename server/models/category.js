

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'category', {
      name: {
        type: DataTypes.STRING(30),
        allowNull: false
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false,
    }
  );
}