INSERT INTO department (name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Director of Sales", 180000, 1),
("Account Manager", 120000, 1),
("Lead Developer", 130000, 2),
("Junior Developer", 65000, 2),
("Software Engineer", 80000, 2),
("Vice President of Finance", 200000, 3),
("Purchasing Manager", 90000, 3),
("Legal Partner", 200000, 4),
("Lawyer", 150000, 4),
("Paralegal", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mickey", "Mouse", 1, NULL),
("Donald", "Duck", 2, 1),
("Bugs", "Bunny", 3, NULL),
("Daffy", "Duck", 4, 3),
("Pluto", "the Dog", 5, 3),
("Minnie", "Mouse", 6, NULL),
("Virginia", "Woolf", 7, 6),
("Gertrude", "Stein", 8, NULL),
("Ernest", "Hemingway", 9, 8),
("James", "Joyce", 10, 8);