// importing npm modules and Express framework
const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

// sets a local host port, although this is all going to run through the command line so I don't think I actually need this.
const PORT = process.env.PORT || 3001;

// Express middleware
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Used to connect to mysql database. will use .env to hide passwords for real apps but not especially concerned in this case.
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

// At least two too many arrays—it'd be better to .map some of these within functions—but these will hold items from the database that we'll need to access in the inquirer prompts.
const departmentArray = [];
const roleArray = [];
const managerArray = [];
const roleArrayTitles = [];
const managerArrayTitles = [];

// puts employee data from database in arrays. Need titles to populate choices in inquirer prompt, and separate ids to add user input to database.
const getManagers = () => {
  const employeeList = `SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS name FROM employee;`;

  db.query(employeeList, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      for (i = 0; i < res.length; i++) {
        managerArray.push(res[i]);
      }
      for (i = 0; i < res.length; i++) {
        managerArrayTitles.push(res[i].name);
      }
    }
  });
  return managerArray;
};

// puts role data from database in arrays
const getRoles = () => {
  const roleList = `SELECT id, title FROM role;`;

  db.query(roleList, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      for (i = 0; i < res.length; i++) {
        roleArray.push(res[i]);
      }
      for (i = 0; i < res.length; i++) {
        roleArrayTitles.push(res[i].title);
      }
    }
  });
  return roleArray;
};

// puts department data from database in array
const getDepartments = () => {
  const departmentList = `SELECT id, name FROM department;`;

  db.query(departmentList, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      for (i = 0; i < res.length; i++) {
        departmentArray.push(res[i]).name;
      }
    }
  });
  return departmentArray;
};

// will run on start. contains command line prompts.
const startTracker = () => {
  // gets the arrays ready for action
  getDepartments();
  getRoles();
  getManagers();

  // user selection menu
  inquirer
    .prompt([
      {
        type: "list",
        name: "doThis",
        message: "What do you want to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Exit",
        ],
      },
    ])
    // user answer calls corresponding function
    .then((answer) => {
      const { doThis } = answer;
      if (doThis === "View All Departments") {
        viewDepartments();
      }
      if (doThis === "View All Roles") {
        viewRoles();
      }
      if (doThis === "View All Employees") {
        viewEmployees();
      }
      if (doThis === "Add a Department") {
        addDepartment();
      }
      if (doThis === "Add an Employee") {
        addEmployee();
      }
      if (doThis === "Add a Role") {
        addRole();
      }
      if (doThis === "Update an Employee Role") {
        updateRole();
      }
      if (doThis === "Exit") {
        exit();
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};

// kicks everything off
startTracker();

// "view" functions all query SQL database connection and use cTable package to display requested data in tables.
const viewDepartments = () => {
  console.log("\n \n NOW VIEWING ALL DEPARTMENTS \n \n");

  const sql = `SELECT department.id, department.name FROM department;`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else console.table(rows);
    startTracker();
  });
};

const viewRoles = () => {
  console.log("\n \n NOW VIEWING ALL ROLES \n \n");

  const sql = `SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id;`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else console.table(rows);
    startTracker();
  });
};

const viewEmployees = () => {
  console.log("\n \n NOW VIEWING ALL EMPLOYEES \n \n");

  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id;`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else console.table(rows);
    startTracker();
  });
};

// "add" functions all insert data into MYSQL database. This code is a mess I'd like to clean up later but it works for now.
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartment",
        message: "Enter the name of the new department.",
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (name)
        VALUES ("${answer.newDepartment}");`;

      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
        } else console.log("\n Department added.");
        viewDepartments();
      });
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newRole",
        message: "Enter the name of the new role.",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What's this role's starting salary?",
      },
      {
        type: "list",
        name: "roleDepartment",
        message: "What department is this role assigned to?",
        choices: departmentArray,
      },
    ])
    .then((answers) => {
      let department_id;

      for (i = 0; i < departmentArray.length; i++) {
        if (answers.roleDepartment === departmentArray[i].name) {
          department_id = departmentArray[i].id;
        }
      }

      const sql = `INSERT INTO role (title, salary, department_id)
      VALUES ("${answers.newRole}", ${answers.roleSalary}, ${department_id});`;

      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
        } else console.log("\n Role added.");
        viewRoles();
      });
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employeeFirstName",
        message: "Enter the employee's first name.",
      },
      {
        type: "input",
        name: "employeeLastName",
        message: "Enter the employee's last name.",
      },
      {
        type: "list",
        name: "employeeRole",
        message: "What is the employee's role?",
        choices: roleArrayTitles,
      },
      {
        type: "list",
        name: "employeeManager",
        message: "Who is the employee's manager?",
        choices: managerArrayTitles,
      },
    ])
    .then((answers) => {
      let role_id;
      let manager_id;

      // this is where I should be using a .map instead of these different arrays. But I needed a separate array to populate choices in inquirer prompt, and this main array to select both the title and the id. if user choice or new employee's role corresponds to role in array (which it will), then create a new variable with id of selected role. need this to insert new employee in database.
      for (i = 0; i < roleArray.length; i++) {
        if (answers.employeeRole === roleArray[i].title) {
          role_id = roleArray[i].id;
        }
      }

      for (i = 0; i < managerArray.length; i++) {
        if (answers.employeeManager === managerArray[i].name) {
          manager_id = managerArray[i].id;
        }
      }

      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.employeeFirstName}", "${answers.employeeLastName}", ${role_id}, ${manager_id});`;

      db.query(sql, (err, res) => {
        if (err) {
          console.log(err);
        } else console.log("\n New employee added.");
        viewEmployees();
      });
    });
};
