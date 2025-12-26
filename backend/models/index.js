const sequelize = require('../config/database');
const Customer = require('./Customer');
const Table = require('./Table');
const Booking = require('./Booking');
const MenuItem = require('./MenuItem');

// Define associations
Customer.hasMany(Booking, { foreignKey: 'customerId', as: 'bookings' });
Booking.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

Table.hasMany(Booking, { foreignKey: 'tableId', as: 'bookings' });
Booking.belongsTo(Table, { foreignKey: 'tableId', as: 'table' });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');
  } catch (error) {
    console.error('❌ Database sync error:', error);
  }
};

module.exports = {
  sequelize,
  Customer,
  Table,
  Booking,
  MenuItem,
  syncDatabase
};
