module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    orderid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    customername: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerphone: {
      type: DataTypes.STRING,
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
    tableid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'orderrequest',
  });
  return Order;
};
