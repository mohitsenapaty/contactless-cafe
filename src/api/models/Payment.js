module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    paymentid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    orderid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    txntoken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recordedon: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'payment',
  });
  return Payment;
};
