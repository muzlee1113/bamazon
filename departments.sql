

-- send your clients to this default database
USE bamazon_db;

--- Create a new MySQL table called departments. Your table should include the following columns:
CREATE TABLE departments (
    -- department_id
    department_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    -- department_name
    department_name VARCHAR(255),
    -- over_head_costs
    over_head_costs INTEGER
    -- -- Modify the products table so that there's a product_sales column,
    -- product_sales DECIMAL(10, 2)
);

-- Populate this database with existing departments
INSERT INTO departments (department_name, over_head_costs)
VALUES  ("Electronic", 20000),
        ("Household", 8000),
        ("Health & Personal Care", 10000),
        ("Beauty", 26000),
        ("Food", 17000),
        ("Toys", 6000),
        ("Pet", 3000),
        ("Clothes", 22000);
        