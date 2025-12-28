const { Table, MenuItem, syncDatabase } = require('../models');

async function seed() {
  try {
    // Sync database to create tables
    await syncDatabase();
    console.log('✅ Database synced');
    
    // Create tables
    await Table.bulkCreate([
      { name: 'Table 1', capacity: 2, location: 'Window' },
      { name: 'Table 2', capacity: 2, location: 'Window' },
      { name: 'Table 3', capacity: 4, location: 'Main Hall' },
      { name: 'Table 4', capacity: 4, location: 'Main Hall' },
      { name: 'Table 5', capacity: 6, location: 'Patio' },
      { name: 'Table 6', capacity: 8, location: 'Private Room' },
    ]);

    console.log('✅ Tables created');

    // Create menu items
    await MenuItem.bulkCreate([
      {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with parmesan and croutons',
        category: 'appetizer',
        price: 12.99,
        isAvailable: true,
        allergens: ['dairy', 'gluten']
      },
      {
        name: 'Bruschetta',
        description: 'Toasted bread with tomatoes, basil, and garlic',
        category: 'appetizer',
        price: 10.99,
        isAvailable: true,
        allergens: ['gluten']
      },
      {
        name: 'Grilled Salmon',
        description: 'Atlantic salmon with seasonal vegetables',
        category: 'main',
        price: 28.99,
        isAvailable: true,
        allergens: ['fish']
      },
      {
        name: 'Ribeye Steak',
        description: '12oz ribeye with mashed potatoes',
        category: 'main',
        price: 38.99,
        isAvailable: true,
        allergens: []
      },
      {
        name: 'Pasta Carbonara',
        description: 'Classic Italian pasta with bacon and cream',
        category: 'main',
        price: 22.99,
        isAvailable: true,
        allergens: ['dairy', 'gluten', 'eggs']
      },
      {
        name: 'Tiramisu',
        description: 'Italian coffee-flavored dessert',
        category: 'dessert',
        price: 9.99,
        isAvailable: true,
        allergens: ['dairy', 'eggs', 'gluten']
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center',
        category: 'dessert',
        price: 11.99,
        isAvailable: true,
        allergens: ['dairy', 'eggs', 'gluten']
      },
      {
        name: 'Red Wine',
        description: 'House red wine',
        category: 'beverage',
        price: 8.99,
        isAvailable: true,
        allergens: []
      },
      {
        name: 'Craft Beer',
        description: 'Local craft beer selection',
        category: 'beverage',
        price: 6.99,
        isAvailable: true,
        allergens: ['gluten']
      },
      {
        name: "Chef's Special",
        description: 'Seasonal special dish',
        category: 'special',
        price: 45.99,
        isAvailable: true,
        allergens: []
      }
    ]);

    console.log('✅ Menu items created');
    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

// Run seeding
const db = require('../config/database');
db.authenticate()
  .then(() => {
    console.log('Database connected');
    return seed();
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
