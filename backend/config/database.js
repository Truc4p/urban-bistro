const { Sequelize } = require('sequelize');
require('dotenv').config();

// Support both connection string (DATABASE_URL) and individual variables
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false // Required for Render/Railway
        } : false
      },
      pool: {
        max: 20,        // Increased from 5 to support 100+ concurrent connections
        min: 5,         // Increased from 0 to maintain ready connections
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 20,
          min: 5,
          acquire: 30000,
          idle: 10000
        }
      }
    );

module.exports = sequelize;
