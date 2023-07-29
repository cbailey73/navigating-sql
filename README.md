# Command-Line SQL Navigation

## Description
This project was designed to allow business managers to easily add, update, and delete job descriptions and employee information contained within an SQL database. It uses inquirer to prompt the user about information they wish to see and changes they wish to make to their business' personnel database.

The structure of the database is set up in the schema.sql file. The database is split into three tables. The first contains the name and id of all departments. The second contains the id, name, and salary for all roles in the company, as well as the id of the department the role belongs to. The third contains the id, first name, and last name of all employees, as well as the id of the employee's role and the id of their manager.

The database is accessed and modified through responses to inquirer prompts entered into the terminal of the connection.js file. This allows users to view all departments, roles, and employees; add a department, role, or employee; update an employee's role or manager; and delete an employee.

## Usage
Before using this project, ensure that you have SQL installed on your computer. Details on how to install SQL can be found here: 

Both inquirer (version 8.2.4) and mysql2 (any version) are required for this project to work. Navigate to the terminal of connection.js and type in "npm install inquirer@8.2.4", and then, once installed, "npm install mysql2". Afterwards, type "npm i" to initialize the installations.

Next, navigate to the terminal of the "databases" file. Type in "mysql -u root -p" and 
