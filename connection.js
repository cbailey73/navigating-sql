const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connection to sql database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'firework4412', // if using different computer/password replace here
  database: 'business_db',
});  

////////////////////////////////////////////////////////// VIEW TABLES ///////////////////////////////////////

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

///////////////////////////////////////////////////////////// ADD TO TABLES ///////////////////////////////

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
  // Fetch the list of existing departments from the database
  db.query('SELECT id, title FROM departments', (error, results) => {
    if (error) throw error;
    const departmentChoices = results.map((department) => {
      return {
        name: department.title,
        value: department.id,
      };
    });

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
        type: 'list',
        name: 'department_id',
        message: 'Select the department this role belongs to:',
        choices: departmentChoices,
      },
    ]).then((answers) => {
      db.query(
        'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
        [answers.title, answers.salary, answers.department_id],
        (error) => {
          if (error) throw error;
          console.log('Role added successfully!');
          mainMenu();
        }
      );
    });
  });
};

// Function to add an employee
function addEmployee() {
  // Fetch the list of existing roles from the database
  db.query('SELECT id, title FROM roles', (error, results) => {
    if (error) throw error;
    const roleChoices = results.map((role) => {
      return {
        name: role.title,
        value: role.id,
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

        managerNames.push({ name: 'None', value: null });

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
              type: 'list', 
              name: 'role_id',
              message: "Select the role for this employee:",
              choices: roleChoices,
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
              'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
              [
                answers.first_name,
                answers.last_name,
                answers.role_id,
                answers.manager_id,
              ],
              (error) => {
                if (error) throw error;
                console.log('Employee added successfully!');
                mainMenu();
              }
            );
          });
      }
    );
  });
};

//////////////////////////////////////////////////////// CHANGE EMPLOYEE QUALITIES ////////////////////////////

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

    // Fetch the list of existing roles from the database
    db.query('SELECT id, title FROM roles', (error, results) => {
      if (error) throw error;
      const roleChoices = results.map((role) => {
        return {
          name: role.title,
          value: role.id,
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
            type: 'list', // Use 'list' type for role selection
            name: 'new_role_id',
            message: "Select the new role for the employee:",
            choices: roleChoices,
          },
        ])
        .then((answers) => {
          db.query(
            'UPDATE employees SET role_id = ? WHERE id = ?',
            [answers.new_role_id, answers.employee_id],
            (error) => {
              if (error) throw error;
              console.log('Employee role updated successfully!');
              mainMenu();
            }
          );
        });
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

///////////////////////////////////////////////////////////////// MISCELLANEOUS ///////////////////////////////

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
          name: 'department_id',
          message: 'Select a department to view its budget:',
          choices: departmentChoices
        },
      ])
      .then((answers) => {
        db.query(
          `SELECT departments.title AS department, SUM(roles.salary) AS budget
          FROM employees
          JOIN roles ON employees.role_id = roles.id
          JOIN departments ON roles.department_id = departments.id
          WHERE departments.id = ?
          GROUP BY departments.title`,
          [answers.department_id],
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
          console.table(results);
          mainMenu();
        });
      });
  });
};

// Function to remove an employee from the database
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

//////////////////////////////////////////////////////////// MAIN MENU /////////////////////////////////////

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