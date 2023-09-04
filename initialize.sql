DROP DATABASE IF EXISTS EmployeeTracker;
CREATE DATABASE EmployeeTracker;
USE EmployeeTracker;

-- Create department table
CREATE TABLE department 
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30)
);

-- Create role table
CREATE TABLE role
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30), 
    salary DECIMAL,
    department_id INT, 
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create employee table
CREATE TABLE employee
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30), 
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id)
);

-- Sample/seed records
-- Some departments
INSERT INTO department (name) VALUES ("Finance");
INSERT INTO department (name) VALUES ("Marketing");
INSERT INTO department (name) VALUES ("Sales");

-- Some roles
INSERT INTO role (title, salary, department_id) VALUES ("Finance Manager",50000,1);
INSERT INTO role (title, salary, department_id) VALUES ("Sales Manager",70000,3);
INSERT INTO role (title, salary, department_id) VALUES ("Marketing Department Manager",60000,2);
INSERT INTO role (title, salary, department_id) VALUES ("Slave", 1, 1);

-- Some employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Tim","Smith",4,2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Debbie","Gilboy",1,NULL);
