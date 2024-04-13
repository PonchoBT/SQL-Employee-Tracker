const inquirer = require("inquirer");
const mysql = require("mysql2");

// Create MySQL connection
const connection = mysql.createConnection({
  port: 3306,
  host: "localhost",
  user: "root",
  password: "diegoangel",
  database: "employee_tracker_db",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
  // Start application
  startApp(connection);
});

// Function to display a stylized title ASCII
function displayEmployeeTracker() {
  const employeeTracker = `
\x1b[32m  _______  __   __  _______  ___      _______  __   __  _______  _______   
\x1b[32m |       ||  |_|  ||       ||   |    |       ||  | |  ||       ||       |  
\x1b[32m |    ___||       ||    _  ||   |    |   _   ||  |_|  ||    ___||    ___|  
\x1b[32m |   |___ |       ||   |_| ||   |    |  | |  ||       ||   |___ |   |___   
\x1b[32m |    ___||       ||    ___||   |___ |  |_|  ||_     _||    ___||    ___|  
\x1b[32m |   |___ | ||_|| ||   |    |       ||       |  |   |  |   |___ |   |___   
\x1b[32m |_______||_|   |_||___|    |_______||_______|  |___|  |_______||_______|  
\x1b[31m  _______  ______    _______  _______  ___   _  _______  ______            
\x1b[31m |       ||    _ |  |   _   ||       ||   | | ||       ||    _ |           
\x1b[31m |_     _||   | ||  |  |_|  ||       ||   |_| ||    ___||   | ||           
\x1b[31m   |   |  |   |_||_ |       ||       ||      _||   |___ |   |_||_          
\x1b[31m   |   |  |    __  ||       ||      _||     |_ |    ___||    __  |         
\x1b[31m   |   |  |   |  | ||   _   ||     |_ |    _  ||   |___ |   |  | |         
\x1b[31m   |___|  |___|  |_||__| |__||_______||___| |_||_______||___|  |_|                                     
  `;
  console.log(employeeTracker);
}
displayEmployeeTracker();


// Function to start the application
function startApp(connection) {
  // Prompt user for action
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Update an employee manager",
        "View employees by manager",
        "View employees by department",
        "Delete a department",
        "Delete a role",
        "Delete an employee",
        "View total utilized budget of a department",
        "Exit",
      ],
    })
    .then((answer) => {
      // Exit if the user chooses 'Exit'
      if (answer.action === "Exit") {
        connection.end(); // Close MySQL connection
        console.log("See you goodbye!!");
        return;
      }

      // Otherwise, execute the chosen action
      const actionMap = {
        "View all departments": viewDepartments,
        "View all roles": viewRoles,
        "View all employees": viewEmployees,
        "Add a department": addDepartment,
        "Add a role": addRole,
        "Add an employee": addEmployee,
        "Update an employee role": updateEmployeeRole,
        "Update an employee manager": updateEmployeeManager,
        "View employees by manager": viewEmployeesByManager,
        "View employees by department": viewEmployeesByDepartment,
        "Delete a department": deleteDepartment,
        "Delete a role": deleteRole,
        "Delete an employee": deleteEmployee,
        "View total utilized budget of a department": viewDepartmentBudget,
      };

      if (actionMap.hasOwnProperty(answer.action)) {
        actionMap[answer.action](connection);
      } else {
        console.log("Invalid choice! Please try again.");
        startApp(connection);
      }
    });
}

// Function to view all departments
function viewDepartments(connection) {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp(connection); 
  });
}

// Function to view all roles
function viewRoles(connection) {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp(connection); 
  });
}

// Function to view all employees
function viewEmployees(connection) {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp(connection); 
  });
}

// Function to add a department
function addDepartment(connection) {
  inquirer
    .prompt({
      name: "name",
      type: "input",
      message: "Enter the name of the department:",
    })
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.name,
        },
        (err) => {
          if (err) throw err;
          console.log("Department added successfully!");
          startApp(connection); 
        }
      );
    });
}

// Function to add a role
function addRole(connection) {
  connection.query("SELECT * FROM department", (err, departments) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the title of the role:",
        },
        {
          name: "salary",
          type: "number",
          message: "Enter the salary for this role:",
        },
        {
          name: "department_id",
          type: "list",
          message: "Select the department for this role:",
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ])
      .then((answer) => {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department_id,
          },
          (err) => {
            if (err) throw err;
            console.log("Role added successfully!");
            startApp(connection); 
          }
        );
      });
  });
}

// Function to add an employee
function addEmployee(connection) {
  connection.query("SELECT * FROM role", (err, roles) => {
    if (err) throw err;
    connection.query("SELECT * FROM employee", (err, employees) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "Enter the first name of the employee:",
          },
          {
            name: "last_name",
            type: "input",
            message: "Enter the last name of the employee:",
          },
          {
            name: "role_id",
            type: "list",
            message: "Select the role for this employee:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            name: "manager_id",
            type: "list",
            message: "Select the manager for this employee:",
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
        ])
        .then((answer) => {
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: answer.role_id,
              manager_id: answer.manager_id,
            },
            (err) => {
              if (err) throw err;
              console.log("Employee added successfully!");
              startApp(connection); 
            }
          );
        });
    });
  });
}

// Function to update an employee's role
function updateEmployeeRole(connection) {
  connection.query("SELECT * FROM employee", (err, employees) => {
    if (err) throw err;
    connection.query("SELECT * FROM role", (err, roles) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "employee_id",
            type: "list",
            message: "Select the employee to update:",
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            name: "role_id",
            type: "list",
            message: "Select the new role for this employee:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answer) => {
          connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [answer.role_id, answer.employee_id],
            (err) => {
              if (err) throw err;
              console.log("Employee role updated successfully!");
              startApp(connection); 
            }
          );
        });
    });
  });
}

// Function to update an employee's manager
function updateEmployeeManager(connection) {
  connection.query("SELECT * FROM employee", (err, employees) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employee_id",
          type: "list",
          message: "Select the employee to update:",
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
        {
          name: "manager_id",
          type: "list",
          message: "Select the new manager for this employee:",
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
      ])
      .then((answer) => {
        connection.query(
          "UPDATE employee SET manager_id = ? WHERE id = ?",
          [answer.manager_id, answer.employee_id],
          (err) => {
            if (err) throw err;
            console.log("Employee manager updated successfully!");
            startApp(connection); 
          }
        );
      });
  });
}

// Function to view employees by manager
function viewEmployeesByManager(connection) {
  connection.query(
    "SELECT * FROM employee WHERE manager_id IS NOT NULL",
    (err, managers) => {
      if (err) throw err;
      inquirer
        .prompt({
          name: "manager_id",
          type: "list",
          message: "Select the manager to view employees:",
          choices: managers.map((manager) => ({
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id,
          })),
        })
        .then((answer) => {
          connection.query(
            "SELECT * FROM employee WHERE manager_id = ?",
            [answer.manager_id],
            (err, employees) => {
              if (err) throw err;
              console.table(employees);
              startApp(connection); 
            }
          );
        });
    }
  );
}

// Function to view employees by department
function viewEmployeesByDepartment(connection) {
  connection.query("SELECT * FROM department", (err, departments) => {
    if (err) throw err;
    inquirer
      .prompt({
        name: "department_id",
        type: "list",
        message: "Select the department to view employees:",
        choices: departments.map((department) => ({
          name: department.name,
          value: department.id,
        })),
      })
      .then((answer) => {
        connection.query(
          "SELECT * FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ?)",
          [answer.department_id],
          (err, employees) => {
            if (err) throw err;
            console.table(employees);
            startApp(connection); 
          }
        );
      });
  });
}

// Function to delete a department
function deleteDepartment(connection) {
  connection.query("SELECT * FROM department", (err, departments) => {
    if (err) throw err;
    inquirer
      .prompt({
        name: "department_id",
        type: "list",
        message: "Select the department to delete:",
        choices: departments.map((department) => ({
          name: department.name,
          value: department.id,
        })),
      })
      .then((answer) => {
        connection.query(
          "DELETE FROM department WHERE id = ?",
          [answer.department_id],
          (err, result) => {
            if (err) throw err;
            console.log("Department deleted successfully!");
            startApp(connection); 
          }
        );
      });
  });
}

// Function to delete a role
function deleteRole(connection) {
  connection.query("SELECT * FROM role", (err, roles) => {
    if (err) throw err;
    inquirer
      .prompt({
        name: "role_id",
        type: "list",
        message: "Select the role to delete:",
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      })
      .then((answer) => {
        connection.query(
          "DELETE FROM role WHERE id = ?",
          [answer.role_id],
          (err, result) => {
            if (err) throw err;
            console.log("Role deleted successfully!");
            startApp(connection); 
          }
        );
      });
  });
}

// Function to delete an employee
function deleteEmployee(connection) {
  connection.query("SELECT * FROM employee", (err, employees) => {
    if (err) throw err;
    inquirer
      .prompt({
        name: "employeeId",
        type: "list",
        message: "Select the employee you want to delete:",
        choices: employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      })
      .then((answer) => {
        inquirer
          .prompt({
            name: "confirm",
            type: "confirm",
            message: "Are you sure you want to delete this employee?",
          })
          .then((confirmation) => {
            if (confirmation.confirm) {
              connection.query(
                "DELETE FROM employee WHERE id = ?",
                [answer.employeeId],
                (err) => {
                  if (err) throw err;
                  console.log("The employee has been successfully deleted!");
                  startApp(connection);
                }
              );
            } else {
              startApp(connection);
            }
          });
      });
  });
}

// Function to view total utilized budget of a department
function viewDepartmentBudget(connection) {
  connection.query("SELECT * FROM department", (err, departments) => {
    if (err) throw err;
    inquirer
      .prompt({
        name: "departmentId",
        type: "list",
        message: "Select the department to view total utilized budget:",
        choices: departments.map((department) => ({
          name: department.name,
          value: department.id,
        })),
      })
      .then((answer) => {
        const query = `
        SELECT SUM(role.salary) AS total_budget
        FROM employee
        INNER JOIN role ON employee.role_id = role.id
        WHERE role.department_id = ?
      `;
        connection.query(query, [answer.departmentId], (err, result) => {
          if (err) throw err;
          console.log(
            `Total utilized budget of the ${
              departments.find((dept) => dept.id === answer.departmentId).name
            } department is: $${result[0].total_budget}`
          );
          startApp(connection);
        });
      });
  });
}
