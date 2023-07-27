const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connection to sql database
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

// Function to view all roles
function viewAllRoles() {
  db.query(
    `SELECT roles.id, roles.title, roles.salary, departments.title AS department
    FROM roles
    JOIN departments ON roles.department_id = departments.id`,
    (error, results) => {
      if (error) throw error;
      console.table(results);
      mainMenu();
    }
  );
};

// Function to view all employees
function viewAllEmployees() {
  db.query(
    `SELECT employees.id, employees.first_name, employees.last_name,
    roles.title AS job_title, roles.salary AS salary, departments.title AS department, employees.manager_names
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
        name: 'role_title',
        message: "Enter the employee's role title:",
      },
      {
        type: 'list',
        name: 'manager_names',
        message: "Select the manager for this employee:",
        choices: ['Bob Douglas', 'Sally Saltgrass', 'Margaret Moose', 'Horace Horsemouth', 'null']
      }
    ])
    .then((answers) => {
      // Fetch the role_id and department_id based on the role_title entered by the user
      db.query(
        'SELECT id, department_id FROM roles WHERE title = ?',
        [answers.role_title],
        (error, result) => {
          if (error) throw error;
          if (result.length === 0) {
            console.log('Invalid role title. Please try again.');
            addEmployee(); 
          } else {
            const role_id = result[0].id;
            const department_id = result[0].department_id;

            // Insert the employee record with role_id and department_id
            db.query(
              'INSERT INTO employees (first_name, last_name, role_id, department_id, manager_names) VALUES (?, ?, ?, ?, ?)',
              [
                answers.first_name,
                answers.last_name,
                role_id,
                department_id,
                answers.manager_names
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
    });
}


// Function to update an employee's role
function updateEmployeeRole() {
  // Fetch the list of current employees from the database
  db.query('SELECT id, first_name, last_name FROM employees', (error, results) => {
    if (error) throw error;
    const employeeChoices = results.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Select the employee you want to update:',
          choices: employeeChoices,
        },
        {
          type: 'input',
          name: 'new_role_title',
          message: "Enter the new role title for the employee:",
        },
      ])
      .then((answers) => {
        const employee_id = answers.employee_id;

        // Fetch the role_id based on the new_role_title entered by the user
        db.query(
          'SELECT id, department_id FROM roles WHERE title = ?',
          [answers.new_role_title],
          (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
              console.log('Invalid role title. Please try again.');
              updateEmployeeRole(); // Prompt again if the role title doesn't exist
            } else {
              const new_role_id = result[0].id;
              const new_department_id = result[0].department_id;

              // Update the employee's role in the database
              db.query(
                'UPDATE employees SET role_id = ?, department_id = ? WHERE id = ?',
                [new_role_id, new_department_id, employee_id],
                (error) => {
                  if (error) throw error;
                  console.log('Employee role updated successfully!');
                  mainMenu();
                }
              );
            }
          }
        );
      });
  });
}

// Function to update an employee's manager
function updateEmployeeManager() {
  // Fetch the list of current employees from the database
  db.query('SELECT id, first_name, last_name FROM employees', (error, results) => {
    if (error) throw error;
    const employeeChoices = results.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Select the employee you want to update:',
          choices: employeeChoices,
        },
        {
          type: 'list',
          name: 'new_manager_name',
          message: "Enter the employee's new manager:",
          choices: ['Bob Douglas', 'Sally Saltgrass', 'Margaret Moose', 'Horace Horsemouth', 'null']
        },
      ])
      .then((answers) => {
        const employee_id = answers.employee_id;

        db.query(
          'UPDATE employees SET manager_names = ? WHERE id = ?',
          [answers.new_manager_name, employee_id],
          (error) => {
            if (error) throw error;
            console.log("Employee's manager updated successfully!");
            mainMenu();
          }
        )
      });
  });
}

function deleteEmployee() {
  db.query('SELECT id, first_name, last_name FROM employees', (error, results) => {
    if (error) throw error;
    const employeeChoices = results.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
  inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select the employee you want to update:',
      choices: employeeChoices,
    }
    ]).then((answers) => {
      const employee_id = answers.employee_id;

      db.query('DELETE FROM employees WHERE id = ?',
      [employee_id],
      (error) => {
        if (error) throw error;
        console.log("Employee deleted successfully!");
        mainMenu();
      }
      )

    })
  })
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
          'Update an employee manager',
          'Delete an employee',
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
        case 'Update an employee manager':
          updateEmployeeManager();
          break;
        case 'Delete an employee':
          deleteEmployee();
          break;
        case 'Exit':
          console.log('Goodbye!');
          db.end();
          process.exit(0);
        default:
          console.log('Invalid choice. Please try again.');
          mainMenu(); 
      }
    });
};

mainMenu();

