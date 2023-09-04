// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database


// Import needed modules
const inquirer = require('inquirer');
const mysql = require('mysql2');

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

async function init() {

    // Ask the questions....
    let exit = false;
    while (exit == false) {

        // Ask the main question
        console.log(); // blank line
        let answers = await inquirer.prompt(questions);

        // Respond based on the answer...
        if (answers.menuChoice == "view all departments") {
            console.log("Access DB, get list of all departments, display list.");
            // Access DB
            // Get a list of all depts
            // Display the list
        }

        if (answers.menuChoice == "view all roles") {
            console.log("Access DB, get list of all roles display list.");
            // Access DB
            // Get a list of all roles
            // Display the list
        }

        if (answers.menuChoice == "view all employees") {
            console.log("Access DB, get list of all employees, display list.");
            // Access DB
            // Get a list of all employees
            // Display the list
        }

        if (answers.menuChoice == "add a department") {
            console.log("Ask for the new department name to add. Add it to the DB.");
            // Ask for new department name.
            // Add it to the DB
        }

        if (answers.menuChoice == "add a role") {
            console.log("Ask for the new role name to add. Add it to the DB.");
            // Ask for new department name.
            // Add it to the DB
        }


        if (answers.menuChoice == "add an employee") {
            console.log("Ask for the new employee name to add. Add it to the DB.");
            // Ask for new department name.
            // Add it to the DB
        }


        if (answers.menuChoice == "update a new employee role") {
            console.log("Ask for the new upated employee role. Add it to the DB.");
            // Ask for new department name.
            // Add it to the DB
        }


        if (answers.menuChoice == "quit") {
            console.log("Ask to quit. Add it to the DB.");
            // Ask for new department name.
            // Add it to the DB
        }
        
        // Finish adding response holders. XXXXXXXX









        if (answers.menuChoice == "quit") {
            console.log("Thank you for playing....");
            exit = true; // leave the while loop
        }

    }
}

init();



// {
//     type: "list",
//     name: "menuChoice",
//     message: "Enter your github username:",
//     when: (answers) => {
//         if (answers.employeeTitle === "Engineer") {
//             return true;
//         }
// }


