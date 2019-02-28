// Create another Node app called bamazonSupervisor.js. Running this application will list a set of menu options:
// dependencies for mysql and inquirer and console.table
var mysql = require("mysql");
var inquirer = require("inquirer")
const cTable = require('console.table');


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

//call the select actions function
selectAction()
// List a set of menu options:
// View Product Sales by Department
// Create New Department
function selectAction() {
    inquirer.prompt([
        {
            name: "action",
            message: "Please select what you want to do:",
            type: "list",
            choices: [
                "View Product Sales by Department",
                "Create New Department",
            ]
        }
        // use if to lead manager to the different functions
    ]).then(function (answers) {
        if (answers.action === "View Product Sales by Department") {
            // run the list function to display all available product
            console.log("=============================================")
            salesByDepartment()
        } else if (answers.action === "Create New Department") {
            // run the lowInventory function to display all product with lower than 5 stock quant
            console.log("=============================================")
            createDepartment() 
        } else {
            console.log("I don't know what you want to do.")
        }
    })
}



// View Product Sales by Department
function salesByDepartment() {
    // When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

    var query = "SELECT departments.department_id as 'Department ID',departments.department_name as 'Department Name',departments.over_head_costs as 'Over Head Costs', sum(products.product_sales) as 'Total Sales', (sum(products.product_sales) - departments.over_head_costs) AS 'Total Profit' FROM products RIGHT JOIN departments ON products.department_name = departments.department_name GROUP BY departments.department_id"
    // console.log(query)
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        console.log("# 'null' in Total Sales and Total Profit means there isn't any product in this department." )
        connection.end();
    });
}

//Create New Department
function createDepartment() {

    inquirer.prompt([
        {
            type: "input",
            message: "Department name: ",
            name: "department_name"
        },
        {
            type: "input",
            message: "Over headcosts: ",
            name: "over_head_costs"
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
            if (!Number.isInteger(parseInt(answers.over_head_costs)) || parseInt(answers.over_head_costs) < 0) {
                console.log("Please enter a positive integer for the head cost!")
                createDepartment()
            } else {
                console.log("Going to add " + answers.department_name + " as a new department...");
                addDepartment(answers.department_name, answers.over_head_costs)
            }
        }
        else {
            console.log("Please decide carefully again then.")
            createDepartment()
        }

    });

}





//function that add product to the database
function addDepartment(department_name, over_head_costs) {
    var query = connection.query(
        "INSERT INTO bamazon_db.departments SET ?",
        {
            department_name: department_name,
            over_head_costs: over_head_costs,
        },
        function (err, res) {
            if (err) throw err
            console.log(res.affectedRows + " department added!\n");
        }

    )
    // console.log(query.sql);
    connection.end();
};