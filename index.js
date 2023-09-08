/*
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role


WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids


WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role


WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to


WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database


WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database


WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database


WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database

*/

// Must have mysql running in the background for this system to work
// On the mac, to start mysql, use: 
//      mysql.server start
// To access the mysql system via the console, use: 
//      mysql -u root -p
// To initialize the database, from within the mysql console, use:
//      source [complete path to initialize.sql];

// Import needed modules
const inquirer = require('inquirer');
// const mysql = require('mysql2');
const mysql = require('mysql2/promise');  // MIGHT be needed for await-style commands
require('dotenv').config()

// Prep the inquirer questions menu
const questions = [
    {
        type: "list",
        name: "menuChoice",
        message: "What would you like to do?",
        choices: [
            "view all departments",
            "view all roles",
            "view all employees",
            "add a department",
            "add a role",
            "add an employee",
            "update an employee role",
            "quit"
        ]
    },

];

async function connectToDB() {
    let c;
    try {
        c = await mysql.createConnection({
            host: '127.0.0.1',
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: 3306
        });
    } catch (e) {
        console.log("Error while attempting to connect to DB");
        console.log(e);
        c = null;
    }
    return c;

}

async function init() {

    // Show funky program splash screen
    // XXXXXXXXX

    // Ask the questions....
    let exit = false;
    while (exit == false) {

        // Ask the main question
        console.log(); // blank line
        let answers = await inquirer.prompt(questions);

        // Respond based on the answer...
        if (answers.menuChoice == "view all departments") {

            // Access DB
            const db_conn = await connectToDB();
            if (db_conn == null) continue;

            // Get a list of all depts
            const sqlQuery = "SELECT * FROM department;"
            const [rows, fields] = await db_conn.query(sqlQuery); // From GITHUB mysql2 examples
            console.table(rows, ['id', 'name']);
            console.log();

            // Close the DB connection
            await db_conn.end();

        }

        if (answers.menuChoice == "view all roles") {

            const db_conn = await connectToDB();
            if (db_conn == null) continue;

            // Get a list of all depts
            //const sqlQuery = "SELECT * FROM role;"
            const sqlQuery = `SELECT role.id, title, salary, department.name as department 
                FROM role 
                INNER JOIN department ON department_id=department.id;`;
            const [rows, fields] = await db_conn.query(sqlQuery); // From GITHUB mysql2 examples
            console.table(rows);
            console.log();

            // Close the DB connection
            await db_conn.end();

        }

        if (answers.menuChoice == "view all employees") {

            const db_conn = await connectToDB();
            if (db_conn == null) continue;

            const sqlQuery = `
                SELECT 
                    employee.id as id, 
                    CONCAT(employee.first_name," ",employee.last_name) as name, 
                    role.title as title, 
                    role.salary as salary, 
                    department.name as department,
                    CONCAT(M.first_name, " ", M.last_name) as manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee M ON employee.manager_id = M.id;
            `;
            const [rows, fields] = await db_conn.query(sqlQuery); // From GITHUB mysql2 examples
            console.table(rows);
            console.log();

            // Close the DB connection
            await db_conn.end();

        }

        if (answers.menuChoice == "add a department") {

            // Use inquirer to get the new department name
            const questions = [
                {
                    type: "input",
                    name: "name",
                    message: "What is the new department name?"
                }
            ];
            let dep_answer = await inquirer.prompt(questions);

            // Connect to the DB
            const db_conn = await connectToDB();
            if (db_conn == null) continue;

            // Execute the add command
            const sqlQuery = `INSERT INTO department (name) VALUES ('${dep_answer.name}');`;
            const result = await db_conn.query(sqlQuery);

            // Notify that the add is complete
            console.log(dep_answer.name + " added to the departments table.");

            // Close the database
            await db_conn.end();

        }

        if (answers.menuChoice == "add a role") {
            // Ask for new department name.
            // Add it to the DB

            // Create an array (or two) that relate department name and department_id
            // Show the list of names to the user to get the department id
            // To get the list of department names, we need to do a DB lookup BEFORE
            // we present the following questions....

            let db_conn = await connectToDB();
            if (db_conn == null) continue;

            // Execute the add command
            let sqlQuery = 'SELECT * FROM department;';
            let result = await db_conn.query(sqlQuery);

            // Create arrays to hold department names ids
            const rows = result[0];  // Should be an array of objects {id, name}
            // Place all of the names in the array departmentNameArray

            let departmentNameArray = [];
            for (let e of rows) {
                departmentNameArray.push(e.name);
            }
            //console.log(departmentNameArray)

            // Close the database
            await db_conn.end();

            // Use inquirer to setup the new role.
            // Requires: title, salary, department_id
            const questions = [
                {
                    type: "input",
                    name: "title",
                    message: "What is the new role title?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the new role salary?"
                },
                {
                    type: "list",
                    name: "departmentName",
                    message: "Select the department for the role:",
                    choices: departmentNameArray
                },

            ];
            let role_answer = await inquirer.prompt(questions);

            // Find the department_id associated with the chosen department name
            let dept_id;
            for (let e of rows) {
                if (e.name == role_answer.departmentName) dept_id = e.id;
            }

            // Connect to the DB
            db_conn = await connectToDB();
            if (db_conn == null) continue;

            // Execute the add command
            sqlQuery = `INSERT INTO role (title, salary, department_id) VALUES ('${role_answer.title}', '${role_answer.salary}', ${dept_id});`;
            result = await db_conn.query(sqlQuery);

            // Notify that the add is complete
            console.log(role_answer.title + " added to the roles table.");

            // Close the database
            await db_conn.end();

        }


        if (answers.menuChoice == "add an employee") {

            // Will need first_name, last_name, role_id, manager_id

            // Construct a array of role names
            let db_conn = await connectToDB();
            if (db_conn == null) continue;

            let sqlQuery = 'SELECT * FROM role;';
            let result = await db_conn.query(sqlQuery);

            // Create arrays to hold role information
            let role_array = result[0];  // Should be an array of objects {id, title, salary, dept_id}
            // Place all of the role titles in the array roleTitles

            let roleTitles = [];
            for (let e of role_array) {
                roleTitles.push(e.title);
            }

            // Construct an array of manager names -- add "None" as an option

            sqlQuery = 'SELECT * FROM employee;';
            result = await db_conn.query(sqlQuery);

            // Create arrays to hold manager information
            let employee_array = result[0];  // Should be an array of objects
            // Place all of the role titles in the array roleTitles

            let managerNames = [];
            for (let e of employee_array) {
                managerNames.push(e.first_name + " " + e.last_name);
            }

            // Add a "None" option at end
            managerNames.push("None");

            // Close the database
            await db_conn.end();

            // Use inquirer to setup the new employee.
            // Will need first_name, last_name, role_id (from array), manager_id (from array)
            const questions = [
                {
                    type: "input",
                    name: "firstName",
                    message: "What is the first name?"
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the last name?"
                },
                {
                    type: "list",
                    name: "roleTitle",
                    message: "What is the role?",
                    choices: roleTitles
                },
                {
                    type: "list",
                    name: "managerName",
                    message: "Select the manager name:",
                    choices: managerNames
                },

            ];
            let employee_answer = await inquirer.prompt(questions);

            // Find the role_id associated with the chosen role title
            let role_id;
            for (let role of role_array) {
                if (role.title == employee_answer.roleTitle) role_id = role.id;
            }

            // Find the id associated with the chosen manager name

            let manager_id = null; // default to null to handle when there is not a manager.
            let managerName;
            for (let manager of employee_array) {
                managerName = manager.first_name + " " + manager.last_name;
                if (managerName == employee_answer.managerName) manager_id = manager.id;
            }


            // Connect to the DB
            db_conn = await connectToDB();
            if (db_conn == null) continue;

            // Execute the add command
            //sqlQuery = `INSERT INTO role (title, salary, department_id) VALUES ('${role_answer.title}', '${role_answer.salary}', ${dept_id});`;
            sqlQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${employee_answer.firstName}', '${employee_answer.lastName}', ${role_id}, ${manager_id} );`;
            result = await db_conn.query(sqlQuery);

            // Notify that the add is complete
            console.log(employee_answer.firstName + " added to the employee table.");

            // Close the database
            await db_conn.end();

        }



        if (answers.menuChoice == "update an employee role") {

            // create an employee array from the db
            // generate an array of employee names
            let db_conn = await connectToDB();
            if (db_conn == null) continue;

            let sqlQuery = 'SELECT * FROM employee;';
            let result = await db_conn.query(sqlQuery);

            // Create arrays to hold manager information
            let employee_array = result[0];  // Should be an array of objects
            // Place all of the role titles in the array roleTitles

            let employeeNames = [];
            for (let e of employee_array) {
                employeeNames.push(e.first_name + " " + e.last_name);
            }

            // create a new role array from the db
            // generate an array of role titles
            sqlQuery = 'SELECT * FROM role;';
            result = await db_conn.query(sqlQuery);

            // Create arrays to hold role information
            let role_array = result[0];  // Should be an array of objects {id, title, salary, dept_id}
            // Place all of the role titles in the array roleTitles

            let roleTitles = [];
            for (let e of role_array) {
                roleTitles.push(e.title);
            }

            // Close the database
            await db_conn.end();

            // Use inquirer to ask for an employee name from the list of names

            const questions = [
                {
                    type: "list",
                    name: "employeeName",
                    message: "Which employee's role do you want to update?",
                    choices: employeeNames
                },
                {
                    type: "list",
                    name: "newRoleTitle",
                    message: "Which role do you want to assign the selected employee?",
                    choices: roleTitles
                },
            ]

            // Ask for a new role name from the list of roles
            let answers = await inquirer.prompt(questions);

            // Find the id numbers that correspond to the chosen employee and role
            // answers.employeeName is the first name, space, last name of employee
            // answers.newRoleTitle is the title of the role
            let role_id;
            for (let role of role_array) {
                if (role.title == answers.newRoleTitle) role_id = role.id;
            }

            let employee_id = null; // default to null to handle when there is not a manager.
            let employeeName;
            for (let employee of employee_array) {
                employeeName = employee.first_name + " " + employee.last_name;
                if (employeeName == answers.employeeName) employee_id = employee.id;
            }

            // Connect to the db
            db_conn = await connectToDB();
            if (db_conn == null) continue;
            
            // Update the employee record with the associated new role
            // Create the sql
            sqlQuery = `UPDATE employee SET role_id = ${role_id} WHERE id = ${employee_id};`;

            // Execute the sql
            result = await db_conn.query(sqlQuery);

            // Close the db
            await db_conn.end();

            // Notify user of success
            console.log("connection received");

        }


        if (answers.menuChoice == "quit") {
            console.log("Thank you for playing....");
            exit = true; // leave the while loop
        }

    }
}

init();

