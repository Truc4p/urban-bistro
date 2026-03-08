const express = require('express');
const router = express.Router();
const { Table, MenuItem } = require('../models');

// Temporary seed endpoint - REMOVE IN PRODUCTION!
router.post('/seed', async (req, res) => {
  try {
    // Check for admin key
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_SEED_KEY) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Clear existing data
    await MenuItem.destroy({ where: {} });
    await Table.destroy({ where: {} });
    
    // Create tables
    await Table.bulkCreate([
      { name: 'Table 1', capacity: 2, location: 'Window' },
      { name: 'Table 2', capacity: 2, location: 'Window' },
      { name: 'Table 3', capacity: 4, location: 'Main Hall' },
      { name: 'Table 4', capacity: 4, location: 'Main Hall' },
      { name: 'Table 5', capacity: 6, location: 'Patio' },
      { name: 'Table 6', capacity: 8, location: 'Private Room' },
    ]);

    // Create menu items (abbreviated for brevity)
    await MenuItem.bulkCreate([
      // Appetizers
      { name: 'Caesar Salad', description: 'Fresh romaine lettuce with parmesan and croutons', category: 'appetizer', price: 12.99, isAvailable: true, allergens: ['dairy', 'gluten'], imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80' },
      { name: 'Bruschetta', description: 'Toasted bread with tomatoes, basil, and garlic', category: 'appetizer', price: 10.99, isAvailable: true, allergens: ['gluten'], imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&q=80' },
      { name: 'Calamari Fritti', description: 'Crispy fried calamari with marinara sauce', category: 'appetizer', price: 14.99, isAvailable: true, allergens: ['gluten', 'seafood'], imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80' },
      { name: 'Buffalo Wings', description: 'Spicy chicken wings with blue cheese dip', category: 'appetizer', price: 13.99, isAvailable: true, allergens: ['dairy'], imageUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=800&q=80' },
      { name: 'French Onion Soup', description: 'Classic soup with caramelized onions and gruyere cheese', category: 'appetizer', price: 11.99, isAvailable: true, allergens: ['dairy', 'gluten'], imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80' },
      { name: 'Shrimp Cocktail', description: 'Chilled jumbo shrimp with cocktail sauce', category: 'appetizer', price: 16.99, isAvailable: true, allergens: ['seafood'], imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80' },
      { name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil with balsamic glaze', category: 'appetizer', price: 13.99, isAvailable: true, allergens: ['dairy'], imageUrl: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&q=80' },
      
      // Main Courses
      { name: 'Grilled Salmon', description: 'Atlantic salmon with seasonal vegetables', category: 'main', price: 28.99, isAvailable: true, allergens: ['fish'], imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80' },
      { name: 'Ribeye Steak', description: '12oz ribeye with mashed potatoes', category: 'main', price: 38.99, isAvailable: true, allergens: [], imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80' },
      { name: 'Pasta Carbonara', description: 'Classic Italian pasta with bacon and cream', category: 'main', price: 22.99, isAvailable: true, allergens: ['dairy', 'gluten', 'eggs'], imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80' },
      { name: 'Lobster Thermidor', description: 'Whole lobster with creamy cognac sauce', category: 'main', price: 52.99, isAvailable: true, allergens: ['seafood', 'dairy'], imageUrl: 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=800&q=80' },
      { name: 'Chicken Parmesan', description: 'Breaded chicken breast with marinara and mozzarella', category: 'main', price: 24.99, isAvailable: true, allergens: ['dairy', 'gluten'], imageUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&q=80' },
      { name: 'Lamb Chops', description: 'Grilled lamb chops with rosemary and garlic', category: 'main', price: 42.99, isAvailable: true, allergens: [], imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80' },
      { name: 'Seafood Paella', description: 'Spanish rice dish with shrimp, mussels, and calamari', category: 'main', price: 34.99, isAvailable: true, allergens: ['seafood'], imageUrl: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800&q=80' },
      { name: 'Mushroom Risotto', description: 'Creamy arborio rice with wild mushrooms and truffle oil', category: 'main', price: 26.99, isAvailable: true, allergens: ['dairy', 'gluten'], imageUrl: 'https://images.unsplash.com/photo-1637806930600-37fa8892069d?w=800&q=80' },
      { name: 'Filet Mignon', description: '8oz tender beef filet with béarnaise sauce', category: 'main', price: 46.99, isAvailable: true, allergens: ['dairy', 'eggs'], imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80' },
      { name: 'Duck Confit', description: 'Slow-cooked duck leg with orange glaze', category: 'main', price: 36.99, isAvailable: true, allergens: [], imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&q=80' },
      { name: 'Vegetable Stir Fry', description: 'Asian vegetables with tofu in ginger soy sauce', category: 'main', price: 19.99, isAvailable: true, allergens: ['soy'], imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80' },
      { name: 'Pork Tenderloin', description: 'Herb-crusted pork with apple chutney', category: 'main', price: 29.99, isAvailable: true, allergens: ['gluten'], imageUrl: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=800&q=80' },
      
      // Desserts
      { name: 'Tiramisu', description: 'Italian coffee-flavored dessert', category: 'dessert', price: 9.99, isAvailable: true, allergens: ['dairy', 'eggs', 'gluten'], imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80' },
      { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', category: 'dessert', price: 11.99, isAvailable: true, allergens: ['dairy', 'eggs', 'gluten'], imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80' },
      { name: 'Crème Brûlée', description: 'Classic French custard with caramelized sugar', category: 'dessert', price: 10.99, isAvailable: true, allergens: ['dairy', 'eggs'], imageUrl: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800&q=80' },
      { name: 'New York Cheesecake', description: 'Rich cheesecake with berry compote', category: 'dessert', price: 12.99, isAvailable: true, allergens: ['dairy', 'eggs', 'gluten'], imageUrl: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&q=80' },
      { name: 'Panna Cotta', description: 'Italian cream dessert with raspberry sauce', category: 'dessert', price: 10.99, isAvailable: true, allergens: ['dairy'], imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80' },
      { name: 'Apple Tart', description: 'Homemade apple tart with vanilla ice cream', category: 'dessert', price: 11.99, isAvailable: true, allergens: ['dairy', 'gluten', 'eggs'], imageUrl: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=800&q=80' },
      { name: 'Gelato Trio', description: 'Three scoops of artisan gelato', category: 'dessert', price: 9.99, isAvailable: true, allergens: ['dairy'], imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80' },
      
      // Beverages
      { name: 'Red Wine', description: 'House red wine', category: 'beverage', price: 8.99, isAvailable: true, allergens: [], imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80' },
      { name: 'Craft Beer', description: 'Local craft beer selection', category: 'beverage', price: 6.99, isAvailable: true, allergens: ['gluten'], imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80' },
      { name: 'White Wine', description: 'House white wine', category: 'beverage', price: 8.99, isAvailable: true, allergens: [], imageUrl: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&q=80' },
      { name: 'Mojito', description: 'Classic Cuban cocktail with mint and lime', category: 'beverage', price: 11.99, isAvailable: true, allergens: [], imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80' },
      { name: 'Espresso Martini', description: 'Vodka, coffee liqueur, and espresso', category: 'beverage', price: 13.99, isAvailable: true, allergens: [], imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80' },
      { name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', category: 'beverage', price: 5.99, isAvailable: true, allergens: [], imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80' },
      { name: 'Cappuccino', description: 'Italian espresso with steamed milk', category: 'beverage', price: 4.99, isAvailable: true, allergens: ['dairy'], imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80' },
      { name: 'Iced Tea', description: 'Refreshing house-brewed iced tea', category: 'beverage', price: 3.99, isAvailable: true, allergens: [], imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80' },
      
      // Chef's Special
      { name: "Chef's Special", description: 'Seasonal special dish', category: 'special', price: 45.99, isAvailable: true, allergens: [], imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80' }
    ]);

    res.json({ 
      success: true, 
      message: 'Database seeded successfully',
      data: {
        tables: 6,
        menuItems: 33
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
