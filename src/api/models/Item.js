module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    itemid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    itemname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    picurl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    catagory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'item',
  });
  return Item;
};
