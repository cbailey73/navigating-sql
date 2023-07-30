const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connection to sql database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'firework4412', // if using different computer/password replace here
  database: 'business_db',
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
    `SELECT 
      employees.id,
      employees.first_name,
      employees.last_name,
      roles.title AS job_title,
      departments.title as department,
      roles.salary AS salary,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employees
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS manager ON employees.manager_id = manager.id`,
    (error, results) => {
      if (error) throw error;
      console.table(results);
      mainMenu();
    }
  );
}


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
        [answers.title],
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
          addRole();
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
  db.query(
    'SELECT id, first_name, last_name FROM employees WHERE manager_id IS NULL',
    (error, results) => {
      if (error) throw error;
      const managerNames = results.map((manager) => {
        return {
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.id,
        };
      });

      managerNames.push({name: 'None', value: null});

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
            name: 'manager_id',
            message: "Select the manager for this employee:",
            choices: managerNames,
          },
        ])
        .then((answers) => {
          db.query(
            'SELECT id FROM roles WHERE title = ?',
            [answers.role_title],
            (error, result) => {
              if (error) throw error;
              if (result.length === 0) {
                console.log('Invalid role title. Please try again.');
                addEmployee();
              } else {
                const role_id = result[0].id;

                db.query(
                  'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                  [
                    answers.first_name,
                    answers.last_name,
                    role_id,
                    answers.manager_id,
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
  );
}



// Function to update an employee's role
function updateEmployeeRole() {
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

        db.query(
          'SELECT id FROM roles WHERE title = ?',
          [answers.new_role_title],
          (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
              console.log('Invalid role title. Please try again.');
              updateEmployeeRole();
            } else {
              const new_role_id = result[0].id;

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
      });
  });
}

// Function to update an employee's manager
function updateEmployeeManager() {
  db.query('SELECT id, first_name, last_name FROM employees', (error, results) => {
    if (error) throw error;
    const employeeChoices = results.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });

    db.query(
      'SELECT id, first_name, last_name FROM employees WHERE manager_id IS NULL',
      (error, results) => {
        if (error) throw error;
        const managerNames = results.map((manager) => {
          return {
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id,
          };
        });

      managerNames.push({name: 'None', value: null});

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Select the employee you want to update:',
          choices: employeeChoices
        },
        {
          type: 'list',
          name: 'new_manager_id',
          message: "Enter the employee's new manager:",
          choices: managerNames
        },
      ])
      .then((answers) => {

        db.query(
          'UPDATE employees SET manager_id = ? WHERE id = ?',
          [answers.new_manager_id, answers.employee_id],
          (error) => {
            if (error) throw error;
            console.log("Employee's manager updated successfully!");
            mainMenu();
          }
        )
      });
    });
  });
}

// Function to view the total budget of a given department
function viewDepartmentBudget() {
  db.query('SELECT * FROM departments', (error, results) => {
    if (error) throw error;
    const departmentChoices = results.map((department) => ({
      name: department.title,
      value: department.id,
    }))

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select a department to view its budget:',
          choices: departmentChoices
        },
      ])
      .then((answers) => {
        const departmentId = answers.departmentId;

        db.query(
          `SELECT departments.title AS department, SUM(roles.salary) AS budget
          FROM employees
          JOIN roles ON employees.role_id = roles.id
          JOIN departments ON roles.department_id = departments.id
          WHERE departments.id = ?
          GROUP BY departments.title`,
          [departmentId],
          (error, results) => {
            if (error) throw error;
            console.table(results);
            mainMenu();
          }
        );
      });
  });
}

// Function to view employees by manager
function mapEmployeeManagers() {
  db.query(
    'SELECT id, first_name, last_name FROM employees WHERE manager_id IS NULL',
    (error, results) => {
      if (error) throw error;
      const managerNames = results.map((manager) => {
        return {
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.id,
        };
      });

      const managerFirstName = results[0].first_name;
      const managerLastName = results[0].last_name;
      const managerFullName = managerFirstName + ' ' + managerLastName;

      inquirer.prompt([
        {
          type: 'list',
          name: 'manager_id',
          message: "Which manager's employees would you like to see?",
          choices: managerNames
        }
      ]).then((answers) => {
        db.query('SELECT id, first_name, last_name FROM employees WHERE manager_id = ?',
        [answers.manager_id], (error, results) => {
          if (error) throw error;
          console.log(`Here are the people managed by ${managerFullName}:`);
          console.table(results);
          mainMenu();
        })
      })
  }) // first query end 
} // main function end 

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

// Function to overthrow the corporate hierarchy
function stageRevolt() {
  console.warn('\x1b[31mThis might cause disruptions.\x1b[0m');

  inquirer.prompt([
    {
      type: 'list',
      name: 'response',
      message: 'How big is your yacht?',
      choices: ['Like, really big.', 'What?']
    }
  ]).then((answers) => {
    if (answers.response === 'Like, really big.') {
      console.log('Cool, just checking.');
      mainMenu();
    }

    if (answers.response === 'What?') {
      inquirer.prompt([
        {
          type: 'list',
          name: 'the_ultimate_question',
          message: 'Are you tired of the man keeping you down?',
          choices: ['I am the man', 'Yes']
        }
      ]).then((answers) => {
        if (answers.the_ultimate_question === 'I am the man') {
          console.log('Oops');
          db.end();
          process.exit(0);
        }
    
        if (answers.the_ultimate_question === 'Yes') {
          console.log('Finally');
          db.query('DELETE FROM employees WHERE role_id = 9', (error) => {
            if (error) throw error;

            db.query('DELETE FROM roles WHERE id = 9', (error) => {
              if (error) throw error;

              db.query('DELETE FROM departments WHERE id = 5', (error) => {
                if (error) throw error;

                db.query('UPDATE roles SET salary = 120000', (error) => {
                  if (error) throw error;

                  db.query('UPDATE employees SET manager_id = null', (error) => {
                    if (error) throw error;
                    mainMenu();
                  });
                });
              });
            });
          });
        }
      });
    }
  });
};

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
          'View department budget',
          'View employees by manager',
          'Delete an employee',
          'Quick question',
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
        case 'View department budget':
          viewDepartmentBudget();
          break;
        case 'View employees by manager':
          mapEmployeeManagers();
          break;
        case 'Delete an employee':
          deleteEmployee();
          break;
        case 'Quick question':
          stageRevolt();
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

