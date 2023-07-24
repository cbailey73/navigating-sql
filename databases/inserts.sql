-- Sample data for the departments table
INSERT INTO departments (title) VALUES
('Sales'),
('Marketing'),
('Engineering'),
('Finance');

INSERT INTO roles (title, salary, department_id) VALUES
('Sales Manager', 60000, 1),
('Software Engineer', 80000, 3),
('Marketing Specialist', 70000, 2),
('Accountant', 75000, 4);

INSERT INTO employees (first_name, last_name, role_id, department_id, manager_names) VALUES
('John', 'Doe', 1, 1, 'Bob'),
('Emily', 'Williams', 3, 2, 'Sally'),
('Richard', 'Rich', 4, 4, 'Horace'),
('Sarah', 'Green', 2, 3, 'Margaret');


-- INSERT INTO roles (title, salary, department_id, department_title) VALUES
-- ('Sales Manager', 60000, 1, 'Sales'),
-- ('Software Engineer', 80000, 3, 'Engineering'),
-- ('Marketing Specialist', 70000, 2, 'Marketing'),
-- ('Accountant', 75000, 4, 'Finance');

-- INSERT INTO employees (first_name, last_name, role_id, role_title, department_id, department_title, manager_names) VALUES
-- ('John', 'Doe', 1, 'Sales Assistant', 1, 'Sales', 'Bob'),
-- ('Emily', 'Williams', 3, 'Marketing Specialist', 2, 'Marketing', 'Sally'),
-- ('Richard', 'Rich', 4, 'Accountant', 4, 'Finance', 'Horace'),
-- ('Sarah', 'Green', 2, 'Software Engineer', 3, 'Engineering');
