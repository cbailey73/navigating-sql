const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connection to sql databases
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'firework4412',
  database: 'business_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});  

// Function to view all departments
function viewAllDepartments() {
  db.query('SELECT * FROM departments', (error, results) => {
    if (error) throw error;
    console.table(results);
    mainMenu();
  });
};

// Function to view all roles with department titles
function viewAllRoles() {
  db.query(
    `SELECT roles.*, departments.title AS department_title
    FROM roles
    JOIN departments ON roles.department_id = departments.id`,
    (error, results) => {
      if (error) throw error;
      console.table(results);
      mainMenu();
    }
  );
};

// Function to view all employees with role, salary, and department titles
function viewAllEmployees() {
  db.query(
    `SELECT employees.*, roles.title AS role_title, roles.salary AS role_salary, departments.title AS department_title
    FROM employees
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON employees.department_id = departments.id`,
    (error, results) => {
      if (error) throw error;
      console.table(results);
      mainMenu();
    }
  );
};


// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the name of the department:',
      },
    ])
    .then((answers) => {
      db.query(
        'INSERT INTO departments (title) VALUES (?)',
        [answers.name],
        (error) => {
          if (error) throw error;
          console.log('Department added successfully!');
          mainMenu();
        }
      );
    });
};

// Function to add a role
function addRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role:',
    },
    {
      type: 'number',
      name: 'salary',
      message: 'Enter the salary for this role:',
    },
    {
      type: 'input',
      name: 'department_title',
      message: 'Enter the department this role belongs to:',
    }
  ]).then((answers) => {
    db.query(
      'SELECT id FROM departments WHERE title = ?',
      [answers.department_title],
      (error, result) => {
        if (error) throw error;
        if (result.length === 0) {
          console.log('Invalid department name. Please try again.');
          addRole(); // Prompt again if the department title doesn't exist
        } else {
          const department_id = result[0].id;

          db.query(
            'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
            [answers.title, answers.salary, department_id],
            (error) => {
              if (error) throw error;
              console.log('Role added successfully!');
              mainMenu();
            }
          );

        };
      }
    );
  });
};

// Function to add an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "Enter the employee's first name:",
      },
      {
        type: 'input',
        name: 'last_name',
        message: "Enter the employee's last name:",
      },
      {
        type: 'input',
        name: 'role_title', // Prompt for the role title instead of role_id
        message: "Enter the employee's role title:",
      },
      {
        type: 'input',
        name: 'department_title', // Prompt for the department title instead of department_id
        message: "Enter the employee's department title:",
      },
      {
        type: 'list',
        name: 'manager_names',
        message: "Select the manager for this employee:",
        choices: ['Bob', 'Sally', 'Margaret', 'Horace'], // Populate this array with available manager names
      },
    ])
    .then((answers) => {
      // Fetch the role_id and salary based on the role_title entered by the user
      db.query(
        'SELECT id FROM roles WHERE title = ?',
        [answers.role_title],
        (error, result) => {
          if (error) throw error;
          if (result.length === 0) {
            console.log('Invalid role title. Please try again.');
            addEmployee(); // Prompt again if the role title doesn't exist
          } else {
            const role_id = result[0].id;

            // Fetch the department_id based on the department_title entered by the user
            db.query(
              'SELECT id FROM departments WHERE title = ?',
              [answers.department_title],
              (error, result) => {
                if (error) throw error;
                if (result.length === 0) {
                  console.log('Invalid department title. Please try again.');
                  addEmployee(); // Prompt again if the department title doesn't exist
                } else {
                  const department_id = result[0].id;

                  // Insert the employee record with both role_title, role_id, and salary
                  db.query(
                    'INSERT INTO employees (first_name, last_name, role_id, department_id, manager_names) VALUES (?, ?, ?, ?, ?)',
                    [
                      answers.first_name,
                      answers.last_name,
                      role_id,
                      department_id,
                      answers.manager_names // Save manager names as a comma-separated string
                    ],
                    (error) => {
                      if (error) throw error;
                      console.log('Employee added successfully!');
                      mainMenu();
                    }
                  );
                }
              }
            );
          }
        }
      );
    });
};

// Function to update an employee's role
function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'employee_name',
        message: "Enter the name of the employee you want to update (First Last):",
      },
      {
        type: 'input',
        name: 'new_role_title',
        message: "Enter the new role title for the employee:",
      },
    ])
    .then((answers) => {
      // Fetch the employee_id based on the employee_name entered by the user
      const [first_name, last_name] = answers.employee_name.split(' ');
      db.query(
        'SELECT id FROM employees WHERE first_name = ? AND last_name = ?',
        [first_name, last_name],
        (error, result) => {
          if (error) throw error;
          if (result.length === 0) {
            console.log('Employee not found. Please try again.');
            updateEmployeeRole(); // Prompt again if the employee doesn't exist
          } else {
            const employee_id = result[0].id;

            // Fetch the role_id based on the new_role_title entered by the user
            db.query(
              'SELECT id FROM roles WHERE title = ?',
              [answers.new_role_title],
              (error, result) => {
                if (error) throw error;
                if (result.length === 0) {
                  console.log('Invalid role title. Please try again.');
                  updateEmployeeRole(); // Prompt again if the role title doesn't exist
                } else {
                  const new_role_id = result[0].id;

                  // Update the employee's role in the database
                  db.query(
                    'UPDATE employees SET role_id = ? WHERE id = ?',
                    [new_role_id, employee_id],
                    (error) => {
                      if (error) throw error;
                      console.log('Employee role updated successfully!');
                      mainMenu();
                    }
                  );
                }
              }
            );
          }
        }
      );
    });
}



// Function to display the main menu
function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'menuChoice',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      },
    ])
    .then((answers) => {
      switch (answers.menuChoice) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Goodbye!');
          db.end(); // Close the database connection before exiting
          process.exit(0);
        default:
          console.log('Invalid choice. Please try again.');
          mainMenu(); // Prompt again for an invalid choice
      }
    });
};

mainMenu();

