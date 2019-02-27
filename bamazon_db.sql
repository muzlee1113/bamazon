-- Drops the bamazon_db if it exists currently --
DROP DATABASE IF EXISTS bamazon_db;
-- Creates the "bamazon_db" database --
CREATE DATABASE bamazon_db;

-- send your clients to this default database
USE bamazon_db;

-- Creates the table "products" within bamazon_db --
CREATE TABLE products (
    -- item_id (unique id for each product)
    item_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    -- product_name (Name of product)
    product_name VARCHAR(255),
    -- department_name
    department_name VARCHAR(255),
    -- price (cost to customer)
    price DECIMAL(10, 2),
    -- stock_quantity (how much of the product is available in stores)-- column name| column type| can be null or not
    stock_quantity INTEGER DEFAULT 0,
    -- Modify the products table so that there's a product_sales column,
    product_sales DECIMAL(10, 2)
);

-- Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ("AJAX Liquid Dish Soap", "Household", 4.90, 100),
        ("Kindle", "Electronic", 129.99, 30),
        ("Panasonic Headphone", "Electronic", 7.78, 50),
        ("Gillette Mach3 Men’s Razor Blade Refills", "Health & Personal Care", 21.78, 200),
        ("Foundation Blending Sponge", "Beauty", 12.99, 78),
        ("Oral-B Electric Toothbrush", "Health & Personal Care", 49.94, 120),
        ("Curel Kao Intensive Moisture Cream", "Health & Personal Care", 29.99, 28),
        ("DHC Makeup Remover", "Beauty", 20.89, 20),
        ("Pet Life Pour-Protection Umbrella", "Pet", 12.94, 44),
        ("Purina Adult Dry Dog Food", "Pet", 33.60, 80),
        ("Vitamix 5200 Blender", "Household", 299.99, 10),
        ("ZOREYA Makeup Brushes Premium", "Beauty", 13.49, 20),
        ("Customize your Echo Dot Generation 2", "Electronic", 5.99, 40),
        ("Ourea Weighted Blanket", "Household", 81.43, 55),
        ("Baebody Tea Tree Oil Shampoo", "Health & Personal Care", 10.00, 48);
        


