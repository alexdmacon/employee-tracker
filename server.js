const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

const startTracker = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee_db",
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
    .then((answer) => {
        const { selection } = answer;

      if (selection === "View All Departments") {
          console.log("View All Departments")
        viewDepartments();
      }
      if (answer === "View All Roles") {
        viewRoles();
      }
      if (answer === "View All Employees") {
        viewEmployees();
      }
      if (answer === "Add a Department") {
        addDepartment();
      }
      if (answer === "Add an Employee") {
        addEmployee();
      }
      if (answer === "Add a Role") {
        addRole();
      }
      if (answer === "Update an Employee Role") {
        updateRole();
      }
      if (answer === "Exit") {
        db.end;
      }
    });
};

startTracker();

const viewDepartments = () => {
    console.log("Viewing all departments");

    const sql = `SELECT department.id, department.name FROM department;`;
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else console.table(rows);
    });
};
