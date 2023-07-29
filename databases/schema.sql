DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;

USE business_db;

CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(70) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(70) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE SET NULL,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employees (id) ON DELETE SET NULL
);

-- SELECT roles.*, departments.title AS department_title
-- FROM roles
-- JOIN departments ON roles.department_id = departments.id;

-- SELECT employees.*, roles.title AS role_title, departments.title AS department_title
-- FROM employees
-- JOIN roles ON employees.role_id = roles.id
-- JOIN departments ON employees.department_id = departments.id;

-- CREATE TABLE employees (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     first_name VARCHAR(70) NOT NULL,
--     last_name VARCHAR(80) NOT NULL,
--     role_id INT,
--     FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE SET NULL,
--     role_title VARCHAR(70) NOT NULL,
--     department_id INT,
--     FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
--     department_title VARCHAR(30) NOT NULL,
--     manager_names TEXT NOT NULL
-- );

-- CREATE TABLE roles (
--     id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
--     title VARCHAR(70) NOT NULL,
--     salary DECIMAL(10, 2) NOT NULL,
--     department_id INT,
--     FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
--     department_title VARCHAR(30) NOT NULL
-- );
