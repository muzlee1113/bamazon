// dependencies for mysql and inquirer
var mysql = require("mysql");
var inquirer = require("inquirer")

// set a global variable for inventory length
var length = 0;
// var departmentArr = [];


// connect with mysql local host
var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 8889,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon_db"
});

selectAction()

// List a set of menu options:
function selectAction() {
    inquirer.prompt([
        {
            name: "action",
            message: "Please select what you want to do:",
            type: "list",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        }
        // use if to lead manager to the different functions
    ]).then(function (answers) {
        if (answers.action === "View Products for Sale") {
            // run the list function to display all available product
            console.log("=============================================")
            list()
        } else if (answers.action === "View Low Inventory") {
            // run the lowInventory function to display all product with lower than 5 stock quant
            console.log("=============================================")
            lowInventory()
        } else if (answers.action === "Add to Inventory") {
            // run the
            console.log("=============================================")
            beforePromptAddQuant()
        } else if (answers.action === "Add New Product") {

            // run the promptAddProduct function to prompt questions that set up a new product
            console.log("=============================================")
            beforePromptAddProduct()
        } else {
            console.log("I don't know what you want to do.")
        }
    })
}


// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
function list() {
    connection.connect(function (err) {
        if (err) throw err;
        // console.log("connected as id " + connection.threadId + "\n");
        console.log("Here are all the available products:\n");
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            for (let i in res) {
                console.log(
                    "Item ID:  " + res[i].item_id + " || " +
                    "Name: " + res[i].product_name + " || " +
                    "Category: " + res[i].department_name + " || " +
                    "Price: " + res[i].price + " || " +
                    "Stock: " + res[i].stock_quantity
                );
            }
            console.log(res.length + " items available!")
            connection.end();
        });
    });
}

// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function lowInventory() {
    connection.connect(function (err) {
        if (err) throw err;
        // console.log("connected as id " + connection.threadId + "\n");
        console.log("Here are all the low inventory:\n");
        console.log()
        connection.query("SELECT * FROM products WHERE `stock_quantity` < 5 ", function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            for (let i in res) {
                console.log(
                    "Item ID:  " + res[i].item_id + " || " +
                    "Name: " + res[i].product_name + " || " +
                    "Category: " + res[i].department_name + " || " +
                    "Price: " + res[i].price + " || " +
                    "Stock: " + res[i].stock_quantity
                );
            }
            console.log("\n" + res.length + " items are running out!")
            connection.end();
        });
    });
}

// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function beforePromptAddQuant() {
    connection.connect(function (err) {
        if (err) throw err;
        // console.log("connected as id " + connection.threadId + "\n");
        console.log("Here are all the available products:\n");
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            for (let i in res) {
                console.log(
                    "Item ID:  " + res[i].item_id + " || " +
                    "Name: " + res[i].product_name + " || " +
                    "Category: " + res[i].department_name + " || " +
                    "Price: " + res[i].price + " || " +
                    "Stock: " + res[i].stock_quantity
                );
            }
            console.log(res.length + " items in the inventory!")
            length = res.length
            console.log("\n" + "Please fill in the product information:")
            promptAddQuant()
        });
    })
}

function promptAddQuant() {
    inquirer.prompt([
        {
            type: "input",
            message: "The Item ID of the product you're going to add more:",
            name: "item_id"
        },
        {
            type: "input",
            message: "The amount you want to add to the inventory:",
            name: "add_quantity"
        },
        {
            type: "confirm",
            message: "Ready to add more to the inventory?",
            name: "confirm",
            default: true
        }
    ]).then(function (answers) {
        // console.log(inquirerResponse)
        if (answers.confirm) {
            if (parseInt(answers.item_id) > length || !Number.isInteger(parseInt(answers.item_id))) {
                console.log("Please enter a valid Item ID!")
                promptAddQuant()
            } else {
                console.log("Going to add " + answers.add_quantity + " of item " + answers.item_id + " to the inventory...");
                updateDB(answers.item_id, answers.add_quantity)
            }
        }
        else {
            console.log("Please decide carefully again then.")
            promptAddQuant()
        }

    });
}


//function that update product stock quantity product to the database
function updateDB(selectId, quant) {
    var query = connection.query(
        "UPDATE products SET stock_quantity = stock_quantity + " + parseInt(quant) + " WHERE item_id = " + selectId + ";",
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " stock updated!\n");
            connection.end()
        }
    );
}

// get thde exisiting department arr for the prompt first
function beforePromptAddProduct() {
    connection.connect(function (err) {
        if (err) throw err;
        // console.log("connected as id " + connection.threadId + "\n");
        connection.query("SELECT * FROM departments", function (err, res) {
            var departmentArr = []
            if (err) throw err;
            // Log all results of the SELECT statement
            for (let i in res) {
                departmentArr.push(res[i].department_name)
            }
            console.log(departmentArr)

            console.log("\n" + "Please fill in the new product information:")
            promptAddProduct(departmentArr)
        });
    })
}
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function promptAddProduct(departmentArr) {

    inquirer.prompt([
        {
            type: "input",
            message: "Product name: ",
            name: "product_name"
        },
        {
            type: "rawlist",
            message: "Department Name: ",
            choices: departmentArr,
            name: "department_name",
        },
        {
            type: "input",
            message: "Price: ",
            name: "price"
        },
        {
            type: "input",
            message: "Stock Quantity: ",
            name: "stock_quantity"
        },
        {
            type: "confirm",
            message: "Ready to add this product to the inventory?",
            name: "confirm",
            default: true
        }
    ]).then(function (answers) {
        // console.log(inquirerResponse)
        if (answers.confirm) {
            console.log("Going to add " + answers.product_name + " to the inventory...");
            addProduct(answers.product_name, answers.department_name, answers.price, answers.stock_quantity)
        }
        else {
            console.log("Please decide carefully again then.")
            promptAddProduct()
        }

    });

}



//function that add product to the database
function addProduct(product_name, department_name, price, stock_quantity) {
    var query = connection.query(
        "INSERT INTO bamazon_db.products SET ?",
        {
            product_name: product_name,
            department_name: department_name,
            price: price,
            stock_quantity: stock_quantity,
        },
        function (err, res) {
            if (err) throw err
            console.log(res.affectedRows + " product added!\n");
        }

    )
    // console.log(query.sql);
    connection.end();
};