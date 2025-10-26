-- Insert products based on your existing categories
INSERT INTO products (name, description, price, stock, category_id, image_url, created_at) VALUES 
-- Shirts (Category 1)
('Classic White Shirt', '100% cotton formal shirt for men and women', 29.99, 100, 1, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop', NOW()),
('Casual Blue Shirt', 'Comfortable casual shirt for everyday wear', 24.99, 80, 1, 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=500&h=500&fit=crop', NOW()),
('Striped Business Shirt', 'Professional striped shirt for office wear', 34.99, 60, 1, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop', NOW()),

-- Pants (Category 2)
('Slim Fit Jeans', 'Comfortable slim fit jeans in blue denim', 49.99, 75, 2, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop', NOW()),
('Casual Trousers', 'Lightweight trousers for casual occasions', 39.99, 50, 2, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=500&fit=crop', NOW()),
('Classic Chinos', 'Versatile chino pants in multiple colors', 35.99, 65, 2, 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500&h=500&fit=crop', NOW()),

-- Accessories (Category 3)
('Leather Watch', 'Elegant leather strap watch with silver dial', 89.99, 40, 3, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=500&fit=crop', NOW()),
('Leather Handbag', 'Genuine leather handbag for women', 79.99, 30, 3, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop', NOW()),
('Sunglasses', 'UV protection sunglasses with stylish frame', 45.99, 55, 3, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop', NOW()),

-- Mobiles (Category 4)
('iPhone 15 Pro', '6.1-inch Super Retina XDR, A17 Pro chip, 48MP camera', 999.99, 25, 4, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop', NOW()),
('Samsung Galaxy S24', '6.2-inch Dynamic AMOLED, 50MP camera, 128GB storage', 849.99, 30, 4, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop', NOW()),
('Google Pixel 8', '6.2-inch OLED, Google Tensor G3, advanced AI features', 699.99, 35, 4, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop', NOW()),

-- Mobile Accessories (Category 5)
('Wireless Charger', 'Fast wireless charging pad for smartphones', 29.99, 100, 5, 'https://images.unsplash.com/photo-1609592810793-abeb6c64b5c6?w=500&h=500&fit=crop', NOW()),
('Phone Case', 'Protective phone case with shock absorption', 19.99, 120, 5, 'https://images.unsplash.com/photo-1601593346740-925612772716?w=500&h=500&fit=crop', NOW()),
('Bluetooth Earphones', 'Wireless earphones with noise cancellation', 59.99, 80, 5, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', NOW()),

-- Electronics (Category 6)
('MacBook Pro 14"', 'M3 Pro chip, 16GB RAM, 512GB SSD, Liquid Retina XDR', 1999.99, 15, 6, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop', NOW()),
('Sony Camera', '24MP mirrorless camera with 4K video recording', 1299.99, 20, 6, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop', NOW()),
('Gaming Headset', 'Surround sound gaming headset with microphone', 89.99, 45, 6, 'https://images.unsplash.com/photo-1599669454699-248893623440?w=500&h=500&fit=crop', NOW()),

-- Books (Category 7)
('Clean Code', 'A Handbook of Agile Software Craftsmanship by Robert Martin', 39.99, 50, 7, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop', NOW()),
('The Pragmatic Programmer', 'Your journey to mastery, 20th Anniversary Edition', 44.99, 40, 7, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop', NOW()),
('Design Patterns', 'Elements of Reusable Object-Oriented Software', 49.99, 35, 7, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', NOW()),

-- Home & Kitchen (Category 8)
('Coffee Maker', 'Automatic drip coffee machine with programmable timer', 79.99, 30, 8, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=500&fit=crop', NOW()),
('Air Fryer', 'Digital air fryer with multiple cooking functions', 89.99, 25, 8, 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop', NOW()),
('Blender', 'High-speed blender for smoothies and food processing', 49.99, 40, 8, 'https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?w=500&h=500&fit=crop', NOW());
