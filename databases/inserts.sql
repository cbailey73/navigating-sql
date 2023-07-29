-- Seed data for all tables
INSERT INTO departments (title) VALUES
('Sales'),
('Marketing'),
('Engineering'),
('Finance');

INSERT INTO roles (title, salary, department_id) VALUES
('Sales Manager', 60000, 1),
('Software Engineer', 80000, 3),
('Marketing Specialist', 70000, 2),
('Accountant', 75000, 4),
('Marketing Manager', 10000, 2),
('Engineering Manager', 10000, 3),
('Finance Manager', 10000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 5, null),
('Bob', 'Douglas', 3, 1);

