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
    .catch((error) => {
      if (err) {
        `Error`;
      }
    });
};

startTracker();

const viewDepartments = () => {
  console.log("\n \n NOW VIEWING ALL DEPARTMENTS \n \n");

  const sql = `SELECT department.id, department.name FROM department;`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else console.table(rows);
  });
};
