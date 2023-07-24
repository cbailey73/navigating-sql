const mysql = require('mysql2');
const inquirer = require('inquirer');
const fs = require('fs');

// Read the contents of schema.sql
const schemaSQL = fs.readFileSync('./databases/schema.sql', 'utf-8');

// Read the contents of inserts.sql
const insertsSQL = fs.readFileSync('./databases/inserts.sql', 'utf-8');

// Connection to sql databases
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'firework4412',
  database: 'business_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function setupDatabase() {
  try {
    console.log('Connecting to MySQL server...');
    const connection = await pool.promise().getConnection();
    await connection.query(schemaSQL);
    console.log('Schema and tables created.');

    connection.release();

    console.log('Inserting data into tables...');
    const insertConnection = await pool.promise().getConnection();
    await insertConnection.query(insertsSQL);
    console.log('Data inserted.');

    insertConnection.release();

    console.log('Database setup complete!');
    mainMenu();
  } catch (error) {
    console.error('Error setting up the database:', error);
    process.exit(1);
  }
}

// Call the setupDatabase function to create the schema and insert data
setupDatabase();

// Execute the queries from schema.sql
// pool.query(schemaSQL, (error, results) => {
//     if (error) throw error;
//     console.log('Schema and tables created successfully!');
//   });

// // Execute the queries from inserts.sql
// pool.query(insertsSQL, (error, results) => {
//   if (error) throw error;
//   console.log('Data inserted successfully!');
// });

  

// Function to view all departments
function viewAllDepartments() {
  pool.query('SELECT * FROM departments', (error, results) => {
    if (error) throw error;
    console.table(results);
    mainMenu();
  });
};

// Function to view all roles
function viewAllRoles() {
  pool.query('SELECT * FROM roles', (error, results) => {
    if (error) throw error;
    console.table(results);
    mainMenu();
  });
};

// Function to view all employees
function viewAllEmployees() {
  pool.query('SELECT * FROM employees', (error, results) => {
    if (error) throw error;
    console.table(results);
    mainMenu();
  });
};

// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
      },
    ])
    .then((answers) => {
      pool.query(
        'INSERT INTO departments (name) VALUES (?)',
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
      type:'input',
      name: 'title',
      message: 'Enter the title of the role:'
    },
    {
      type: 'number',
      name: 'salary',
      message: 'Enter the salary for this role:'
    },
    {
      type: 'input',
      name: 'department_title',
      message: 'Enter the department this role belongs to:'
    }
  ]).then((answers) => {
    pool.query(
      'SELECT id FROM departments WHERE title = ? ',
      [answers.department],
      (error, result) => {
        if (error) throw error;
        if (result.length === 0) {
          console.log('Invalid department name. Please try again.');
          addRole(); // Prompt again if the role title doesn't exist
        } else {
          const department_id = result[0].id;

          pool.query(
            'INSERT INTO roles (title, salary, department_id, department_title) VALUES (?, ?, ?, ?)'
            [
              answers.title,
              answers.salary,
              department_id,
              answers.department_title
            ],
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
        type: 'checkbox',
        name: 'manager_names',
        message: "Select the manager(s) for this employee:",
        choices: [Bob, Sally, Margaret, Horace], // Populate this array with available manager names
      },
    ])
    .then((answers) => {
      // Fetch the role_id and salary based on the role_title entered by the user
      pool.query(
        'SELECT id FROM roles WHERE title = ?',
        [answers.role_title],
        (error, result) => {
          if (error) throw error;
          if (result.length === 0) {
            console.log('Invalid role title. Please try again.');
            addEmployee(); // Prompt again if the role title doesn't exist
          } else {
            const role_id = result[0].id;

            // Insert the employee record with both role_title, role_id, and salary
            pool.query(
              'INSERT INTO employees (first_name, last_name, role_id, role_title,\
              department_id, department_title, salary, manager_names) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [
                answers.first_name,
                answers.last_name,
                role_id,
                answers.role_title,
                salary,
                department_id,
                department_title,
                answers.manager_ids.join(', '), // Save manager ids as a comma-separated string
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
      pool.query(
        'SELECT id FROM employees WHERE first_name = ? AND last_name = ?',
        [first_name, last_name],
        (err, result) => {
          if (err) throw err;
          if (result.length === 0) {
            console.log('Employee not found. Please try again.');
            updateEmployeeRole(); // Prompt again if the employee doesn't exist
          } else {
            const employee_id = result[0].id;

            // Fetch the role_id based on the new_role_title entered by the user
            pool.query(
              'SELECT id, department_id, department_title FROM roles WHERE title = ?',
              [answers.new_role_title],
              (err, result) => {
                if (err) throw err;
                if (result.length === 0) {
                  console.log('Invalid role title. Please try again.');
                  updateEmployeeRole(); // Prompt again if the role title doesn't exist
                } else {
                  const new_role_id = result[0].id;
                  const new_department_id = result[0].department_id;
                  const new_department_title = result[0].department_title;

                  // Update the employee's role in the database
                  pool.query(
                    'UPDATE employees SET role_id = ?, role_title = ?, department_id = ?, department_title = ? WHERE id = ?',
                    [new_role_id, answers.new_role_title, new_department_id, new_department_title, employee_id],
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
          pool.end(); // Close the database connection before exiting
          process.exit(0);
        default:
          console.log('Invalid choice. Please try again.');
          mainMenu(); // Prompt again for an invalid choice
      }
    });
};

mainMenu();

