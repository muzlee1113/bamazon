var mysql = require("mysql");
var inquirer = require("inquirer")

// set a global variable for inventory length
var length = 0;

// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
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
        console.log("\n" + res.length + " items available!")
        length = parseInt(res.length)
        select()

        // connection.end();
    });
});

// The app should then prompt users with two messages.
function select() {
    inquirer.prompt([
        // The first should ask them the ID of the product they would like to buy.

        {
            name: "selectId",
            message: "Please enter the Item ID of the product you would like to buy:"
        },
        // The second message should ask how many units of the product they would like to buy.
        {
            name: "quant",
            message: "How many would you like to buy?"
        }
    ]).then(function (answers) {
        if (parseInt(answers.selectId) > length || !Number.isInteger(parseInt(answers.selectId))) {
            console.log("Please enter a valid Item ID!")
            select()
        } else {
            if (!Number.isInteger(parseInt(answers.quant)) || parseInt(answers.quant) < 0) {
                console.log("Please enter a positive integer")
                select()
            } else {
                check(answers.selectId, answers.quant)
            }
        }
    })

}




// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
function check(selectId, quant) {
    var query = "SELECT * FROM products WHERE item_id = '" + selectId + "';"
    // console.log("Query: " + query)
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("You want " + quant + " '" + res[0].product_name + "'.")
        if (parseInt(quant) > parseInt(res[0].stock_quantity)) {
            // If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
            console.log("We don't have that many '" + res[0].product_name + "' available! \nTry something under " + res[0].stock_quantity)
            select()
        } else {
            // However, if your store does have enough of the product, you should fulfill the customer's order.
            console.log("Your order has been placed!")
            var left = parseInt(res[0].stock_quantity) - parseInt(quant)
            console.log(parseFloat(res[0].product_sales))
            var totalPrice = (parseFloat(res[0].price) * parseInt(quant)).toFixed(2)
            var product_sales = (parseFloat(totalPrice) + parseFloat(res[0].product_sales)).toFixed(2)
            console.log(totalPrice)
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
            console.log("Total price is " + totalPrice +
                "\nThank you for your purchase!")
            connection.end()
        }
    );

}




