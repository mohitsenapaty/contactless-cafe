module.exports = (sequelize, DataTypes) => {
  const Catagory = sequelize.define('Catagory', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'catagory',
  });
  return Catagory;
};
