-- Seed data for all tables
INSERT INTO departments (title) VALUES
('Sales'),
('Marketing'),
('Engineering'),
('Finance'),
('Executive');

INSERT INTO roles (title, salary, department_id) VALUES
('Sales Manager', 200000, 1),
('Sales Assistant', 30000, 1),
('Software Engineer', 80000, 3),
('Marketing Specialist', 70000, 2),
('Accountant', 75000, 4),
('Marketing Manager', 200000, 2),
('Engineering Manager', 200000, 3),
('Finance Manager', 200000, 4),
('Head Honcho', 100000000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('Richard', 'Rich', 9, null),
('John', 'Doe', 6, null),
('Clarence', 'Lee', 4, 2),
('Bob', 'Douglas', 4, 2),
('Sally', 'Saltgrass', 1, null),
('Margaret', 'Moose', 7, null),
('Horace', 'Horse', 8, null),
('Lisa', 'Frank', 2, 5),
('Ernesto', 'De Silva', 2, 5),
('Agatha', 'Stills', 3, 6),
('William', 'Romano', 3, 6),
('Seti', 'Thales', 5, 7),
('Sjors', 'Bruno', 5, 7);

