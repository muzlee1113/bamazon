// dependencies
var mysql = require("mysql");
var inquirer = require("inquirer")

// set a global variable for inventory length
var length = 0;

// set up the database
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

// connect the database 
connection.connect(function (err) {
    if (err) throw err;
    console.log("Here are all the available products:\n");
    // display all of the items available for sale. Include the ids, names, and prices of products for sale.
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
        console.log("\n" + res.length + " items available!")
        // save the length of the inventory
        length = parseInt(res.length)
        // run the select function to prompt the user to make purchase
        select()

        // connection.end();
    });
});

// The app should then prompt users with two messages.
function select() {
    inquirer.prompt([
        // ask them the ID of the product they would like to buy.
        {
            name: "selectId",
            message: "Please enter the Item ID of the product you would like to buy:"
        },
        // ask how many units of the product they would like to buy.
        {
            name: "quant",
            message: "How many would you like to buy?"
        }
    ]).then(function (answers) {
        // check whether the id is valid (that is within the length of the inventory and should be a number)
        if (parseInt(answers.selectId) > length || !Number.isInteger(parseInt(answers.selectId))) {
            // if not valid ask for valid and run the select function again as recursion
            console.log("Please enter a valid Item ID!")
            select()
            // if the id is valid, run to check the quantity input
        } else {
            // check if the quantity is a integer
            if (!Number.isInteger(parseInt(answers.quant)) || parseInt(answers.quant) < 0) {
                // if not ask for a positive integer and run the select function again as recursion
                console.log("Please enter a positive integer")
                select()
            } else {
                // if is integer too, run the check function to see whether there are enough stock
                check(answers.selectId, answers.quant)
            }
        }
    })

}




// function that checks if the store has enough of the product to meet the customer's request.
function check(selectId, quant) {
    // select the data of the product with that specific id
    var query = "SELECT * FROM products WHERE item_id = '" + selectId + "';"
    // console.log("Query: " + query)
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("You want " + quant + " '" + res[0].product_name + "'.")
        // if the quant is bigger than the stock quant, then ask the customer to give a lower request number
        if (parseInt(quant) > parseInt(res[0].stock_quantity)) {
            // If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
            console.log("We don't have that many '" + res[0].product_name + "' available! \nTry something under " + res[0].stock_quantity)
            select()
        // if the quant is smaller than the stock quant, then place the order
        } else {
            console.log("Your order has been placed!")
            // do the math for the update function
            // count the stock quantity left
            var left = parseInt(res[0].stock_quantity) - parseInt(quant)
            // count the total price
            var totalPrice = (parseFloat(res[0].price) * parseInt(quant)).toFixed(2)
            // add the total price of the new purchase to existing product sales 
            var product_sales = (parseFloat(totalPrice) + parseFloat(res[0].product_sales)).toFixed(2)
            // run the function to update the database 
            updateDB(selectId, left, totalPrice, product_sales)
        }
    })
}


// updating the SQL database to reflect the remaining quantity.
function updateDB(selectId, left, totalPrice, product_sales) {
    // Once the update goes through, show the customer the total cost of their purchase.
    // function that update product stock quantity product to the database

    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                // update product's stock_quantity column.
                stock_quantity: left,
                // update product's product_sales column.
                product_sales: product_sales
            },
            {
                item_id: selectId
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " data updated!\n");
            // return the total price in console.log
            console.log("Total price is " + totalPrice +
                "\nThank you for your purchase!")
            // end connection
            connection.end()
        }
    );

}




