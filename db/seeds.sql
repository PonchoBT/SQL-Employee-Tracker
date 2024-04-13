INSERT INTO department (name) VALUES
('Board of directors'),
('Engineering'),
('Human Resources'),
('Finance');

INSERT INTO role (title, salary, department_id) VALUES
('CEO', 80000, 1),
('Leader BackEnd', 70000, 2),
('Sr Talent Acquisition', 60000, 3),
('Financial Analyst', 60000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Alfonso', 'Balderas', 1, NULL),
('Angel', 'Moran', 2, 1),
('Diego', 'Balderas', 3, 2),
('Dario', 'Hernandez', 3, 4);

SELECT DATABASE();
SELECT * FROM department;
SELECT * FROM employee;
SELECT * FROM role;