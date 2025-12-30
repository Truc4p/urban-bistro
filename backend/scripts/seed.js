const { Table, MenuItem, syncDatabase } = require('../models');

async function seed() {
  try {
    // Sync database to create tables
    await syncDatabase();
    console.log('✅ Database synced');
    
    // Clear existing data
    await MenuItem.destroy({ where: {} });
    await Table.destroy({ where: {} });
    console.log('🗑️  Cleared existing data');
    
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
        allergens: ['dairy', 'gluten'],
        imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80'
      },
      {
        name: 'Bruschetta',
        description: 'Toasted bread with tomatoes, basil, and garlic',
        category: 'appetizer',
        price: 10.99,
        isAvailable: true,
        allergens: ['gluten'],
        imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&q=80'
      },
      {
        name: 'Grilled Salmon',
        description: 'Atlantic salmon with seasonal vegetables',
        category: 'main',
        price: 28.99,
        isAvailable: true,
        allergens: ['fish'],
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80'
      },
      {
        name: 'Ribeye Steak',
        description: '12oz ribeye with mashed potatoes',
        category: 'main',
        price: 38.99,
        isAvailable: true,
        allergens: [],
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80'
      },
      {
        name: 'Pasta Carbonara',
        description: 'Classic Italian pasta with bacon and cream',
        category: 'main',
        price: 22.99,
        isAvailable: true,
        allergens: ['dairy', 'gluten', 'eggs'],
        imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80'
      },
      {
        name: 'Tiramisu',
        description: 'Italian coffee-flavored dessert',
        category: 'dessert',
        price: 9.99,
        isAvailable: true,
        allergens: ['dairy', 'eggs', 'gluten'],
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80'
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center',
        category: 'dessert',
        price: 11.99,
        isAvailable: true,
        allergens: ['dairy', 'eggs', 'gluten'],
        imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80'
      },
      {
        name: 'Red Wine',
        description: 'House red wine',
        category: 'beverage',
        price: 8.99,
        isAvailable: true,
        allergens: [],
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80'
      },
      {
        name: 'Craft Beer',
        description: 'Local craft beer selection',
        category: 'beverage',
        price: 6.99,
        isAvailable: true,
        allergens: ['gluten'],
        imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80'
      },
      {
        name: "Chef's Special",
        description: 'Seasonal special dish',
        category: 'special',
        price: 45.99,
        isAvailable: true,
        allergens: [],
        imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80'
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
