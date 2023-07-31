# Command-Line SQL Navigation

## Description
This project was designed to allow business managers to easily add, update, and delete job descriptions and employee information contained within an SQL database. It uses inquirer to prompt the user about information they wish to see and changes they wish to make to their business' personnel database.

The structure of the database is set up in the schema.sql file. The database is split into three tables. The first contains the name and id of all departments. The second contains the id, name, and salary for all roles in the company, as well as the id of the department the role belongs to. The third contains the id, first name, and last name of all employees, as well as the id of the employee's role and the id of their manager.

The database is accessed and modified through responses to inquirer prompts entered into the terminal of the connection.js file. This allows users to view all departments, roles, and employees; add a department, role, or employee; update an employee's role or manager; and delete an employee.

## Usage
Before using this project, ensure that you have SQL installed on your computer. Details on how to install SQL can be found [here](https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-shell-getting-started.html).

Once you've ensured you have access to SQL servers, clone this repository onto your computer and open it up in the source-code editor of your choice. Both inquirer (version 8.2.4) and mysql2 (any version) are required for this project to work. Navigate to the terminal of connection.js and type in "npm install inquirer@8.2.4", and then, once installed, "npm install mysql2". Afterwards, type "npm i" to initialize the installations.

Next, navigate to the terminal of the "databases" file. Type in "mysql -u root -p" and follow with your SQL password. Then, source the database schema by typing in "source schema.sql;" into the console, and source the seed values for the tables by typing in "source inserts.sql;". You can now exit the sql server by typing "quit" into the terminal, and navigate back to connection.js. On line 8, it asks for an SQL password. Replace the current password with your own SQL password. Afterwards, navigate back to the connection.js terminal.

Once there, type in "npm start" to access the project's Main Menu.  You will be presented with the Main Menu containing various options. Here is a brief explanation of each option:

View all departments: This option allows you to view all the departments currently stored in the database. It will display a table with department names and IDs.

View all roles: Selecting this option will show you a table containing all the roles available in the company. It includes information such as title, salary, and the department to which each role belongs.

View all employees: This option displays a table with details about all the employees in the company. It includes their first and last names, job title, department, salary, and the name of their manager.

Add a department: Choose this option to add a new department to the database. You will be prompted to enter the name of the department, and it will be added upon successful completion.

Add a role: Select this option to add a new role. You will need to provide the title, salary, and select the department to which the role belongs from a list of existing departments.

Add an employee: Select this option to add a new employee. You will be asked to enter the employee's first and last name, to select a role from existing roles, and to choose a manager for the employee out of a list of existing managers.

Update an employee role: This option allows you to update the role of an existing employee. You will be prompted to select the employee out of a list of current employees, and then choose the new role for them from the list of available roles.

Update an employee manager: If you need to change an employee's manager, select this option. You can choose the employee from a list of current employees and then assign them a new manager from the available options.

View department budget: This option allows you to view the total budget of a specific department. You will be prompted to select a department, and the total amount spent on salaries for that department will be displayed.

View employees by manager: Selecting this option lets you view all the employees managed by a specific manager. You will need to choose the manager from the available options, and the corresponding employees will be shown in a table.

Delete an employee: If you wish to remove an employee from the database, select this option. You will be prompted to choose the employee you want to delete, and they will then be removed from the database.

Exit: This option allows you to exit the application. It will close the database connection and terminate the program.

After performing any action, you will be returned to the Main Menu to continue using the application as needed.

## License
This project is protected under and MIT License. Further details can be found in the "LICENSE" section of the repository.

## Credits
This tutorial was followed to display manager names in the employees table: https://www.w3schools.com/sql/sql_join_left.asp

This tutorial was followed to use null syntax to identify managers: https://www.w3schools.com/sql/sql_null_values.asp

This tutorial was followed to map out query results into name-value pairs: https://forum.freecodecamp.org/t/how-to-use-map-function-in-react-js-with-api/476783/2

This tutorial was followed to terminate the server upon user request: https://www.geeksforgeeks.org/node-js-process-exit-method/
