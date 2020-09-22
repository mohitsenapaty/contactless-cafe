module.exports = (sequelize, DataTypes) => {
  const Orderitem = sequelize.define('Orderitem', {
    orderitemid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    orderid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    itemid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    totalprice: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'orderitem',
  });
  return Orderitem;
};
