
const inquirer = require('inquirer');
const mysql = require('mysql2')
require('console.table')
require('dotenv').config();

const app = require('./index')

// conection to mysql 
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
},
    console.log('Connected')
)

db.connect(err => {
    if (err) {
        console.log(err)
        throw err};
});

// get data 

const showInfo = (option) => {
let query = '';
console.log(`Find the option you selected ${option}`)
switch (option) {
    case 'All Departments':
        query = `SELECT id as Id, 
                name as Department 
                FROM department;`
        break;

        case 'All Roles':
            query = `SELECT roles.id AS Id,
                     roles.title AS Role,
                     roles.salary AS Salary,
                     department.name AS Department
                     FROM roles
                     JOIN department ON roles.department_id = department.id;`;
            break;

       case 'All Employees':
            query = `SELECT roles.id AS Id,
                     CONCAT(employee.first_name, ' ', employee.last_name) AS Name,
                     roles.title AS Role,
                     department.name AS Department,
                     roles.salary AS Salary,
                     IF(employee.manager_id IS NULL, 'Does not have a manager', CONCAT(employee2.first_name, ' ', employee2.last_name)) AS Manager
                     FROM employee
                     JOIN roles ON employee.role_id = roles.id
                     JOIN department ON roles.department_id = department.id
                     LEFT JOIN employee employee2 ON employee.manager_id = employee2.id;`;
            break; 

            case 'Employees by Department':
                query = `SELECT employee.id AS Id,
                         CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee Name',
                         department.name AS Department
                         FROM employee
                         JOIN roles
                         JOIN department ON employee.role_id = roles.id AND roles.department_id = department.id ORDER BY department.id;`;
                break;
            case 'Employees by Manager':
                query = `SELECT employee1.id AS Id,
                         CONCAT(employee1.first_name, ' ', employee1.last_name) AS EmployeeName,
                         IF(employee1.manager_id IS NULL, 'They are bound to no one', CONCAT(employee2.first_name, ' ', employee2.last_name)) AS Manager
                         FROM employee employee1
                         LEFT JOIN employee employee2 ON employee1.manager_id = employee2.id ORDER BY employee2.id;`;
                break;
            case 'Budget of a Department' :
                query = `SELECT department.id AS Id,
                         department.name AS Department,
                         SUM(roles.salary) AS Budget
                         FROM employee
                         JOIN roles
                         JOIN department ON employee.role_id = roles.id AND roles.department_id = department.id
                         GROUP BY department.id;`;
                break;     
        }

        db.query(query, (err, results) => {
            if (err) {console.log(err); return app.firstMenu();}
            // If everything goes well, print this
            console.table(results);
            console.log('back to the menu')
            return app.firstMenu();
        });
    }

    // add function 
const add = (option) => {

    let query = ''
    console.log(`You Selected ${option} the Add function `)

    switch (option) {
        case 'Department':
            inquirer.prompt({
                type: 'input',
                name: 'departmentName',
                message: 'Name of the department you want to add?'
            })
                .then((answer) => {
                    query = `INSERT INTO department (name) VALUES (?)`
                    const params = answer.departmentName;
                    db.query(query, params, function (err, results) {
                        console.table('Department added succesfully!')
                        return app.firstMenu();
                    });

                })
            break;
        case 'Role':
            inquirer.prompt([
                {
                    name: 'roleName',
                    message: 'Role you want to add?',
                },
                {
                    name: 'salary',
                    message: 'Salary for the Role?',
                },
                {
                    type: 'list',
                    name: 'departmentId',
                    message: 'What is the department Id?',
                    choices: ['Logistics', 'Legal', 'Marketing', 'Accounting', 'HR']
                },
            ]).then((answer) => {
                console.log(`answer: ${answer}`)
                let selectedDepartment;
                if (answer.departmentId === 'Logistics') {
                    selectedDepartment = 1
                } else if (answer.departmentId === 'Legal') {
                    selectedDepartment = 2
                } else if (answer.departmentId === 'Marketing') {
                    selectedDepartment = 3
                } else if (answer.departmentId === 'Accounting') {
                    selectedDepartment = 4
                } else {
                    selectedDepartment = 5
                }
                query = `INSERT INTO roles (title, salary, department_id) VALUES ('${answer.roleName}', ${answer.salary}, ${answer.selectedDepartment}')`
                db.query(query, function (err, results) {
                    if (err) throw err;
                    console.table('Role Added Succesfully')
                    return app.firstMenu();
                });

            });
            break;

        case 'Employee':
            inquirer.prompt([
                {
                    name: 'firstName',
                    message: 'Employee first name:',
                },
                {
                    name: 'lastName',
                    message: 'Employee last name:',
                },
                {
                    name: 'roleID',
                    message: 'What is the role IF of the employee:',
                },
                {
                    type: 'list',
                    name: 'managerID',
                    message: 'what id the Manager ID:',
                    choices: ['James Mclon', 'Carlos Tevez', 'Carlos Tevez', 'Raquel Remun', 'George Desa'],
                }

            ]).then((answer) => {
                console.log(`answer: ${answer}`)
                let managerSel;
                if (answer.managerID === 'James Mclon') {
                    managerSel = 3
                } else if (answer.managerID === 'Carlos Tevez') {
                    managerSel = 6
                } else if (answer.managerID === 'Carlos Tevez') {
                    managerSel = 9
                } else if (answer.managerID === 'Raquel Remun') {
                    managerSel = 12
                } else {
                    managerSel = 15
                }

                query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.firstName}', '${answer.lastName}', '${answer.roleID}', '${answer.managerID}')`
                db.query(query, function (err, results) {
                    if (err) throw err;
                    console.table('Employee Added Succesfully')
                    return app.firstMenu();
                });
            });
            break;
        default:
            console.log('Error');
            break;
    }

}

// update function 


const update = (option) => {
    let query = ''
    console.log(`Add Function, you selected ${option}`)

    switch (option) {
        case 'Update an Employee Role':
            query = `SELECT * FROM employee;`;
            db.query(query, function (err, results) {
                if (err) throw err;
                console.table(results)

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'employeeID',
                        message: "ID of the employee to be updated?",
                    },
                ])
                    .then((answer) => {
                        let employeeID = answer.employeeID
                        query = `SELECT * FROM roles;`;
                        db.query(query, function (err, results) {
                            if (err) throw err;
                            console.table(results)
                            inquirer.prompt([
                                {
                                    type: 'input',
                                    name: 'roleID',
                                    message: "ID of the role to be updated?",
                                },
                            ])
                                .then((answer) => {
                                    query = `UPDATE employee SET role_id = (?) WHERE id = (?)`
                                    db.query(query, [answer.roleID, employeeID], function (err, results) {
                                        if (err) throw err;
                                        console.table('Successfully updated role')
                                        return app.firstMenu();
                                    })
                                });
                        })
                    });
            })
            break;

            case 'Update an Employee Manager':

            query = `SELECT * FROM employee:`
            db.query (query, function(err, results) {
                if (err) throw err;
                console.table(results)
                inquirer.prompt([
                        {
                            type: 'input',
                            name: 'employeeID',
                            message: "ID of the employee you want to update?",
                        },
                    ])
                    .then((answer) => {
                        let employeeID = answer.employeeID
                        query = `SELECT * FROM employee;`;
                        db.query(query, function (err, results) {
                            if (err) throw err;
                            console.table(results)
                            inquirer.prompt([
                                {
                                    type: 'input',
                                    name: 'managerID',
                                    message: "ID of the employee who will have an employee reassigned?",
                                },
                            ])
                            .then((answer) => {
                                query = `UPDATE employee SET manager_id = (?) WHERE id = (?)`
                                db.query(query, [answer.managerID, employeeID], function (err, results) {
                                    if (err) throw err;
                                    console.table('Role added succesfully')
                                    return app.firstMenu(); 
                            })
                        });
                    })
            });
    })
    default: 
    console.log('Error')
                break;
            
    }
}

// delete function 


const deleteOption = (option) => {
    let query = ''
    console.log(`Function selected ${option} is to delete`)
    switch(option) {
        case 'Delete a department':
            inquirer.prompt({
                type: 'list',
                name: 'departmentId',
                message: "What department would you like to delete?",
                choices: ['Logistics', 'Legal', 'Marketing', 'Accounting', 'HR']
            })     .then((answer) => {
                console.log(`answer: ${answer.departmentId}`)
                let selectedDepartment;
                if (answer.departmentId === 'Logistics') {
                    selectedDepartment = 1
                } else if (answer.departmentId === 'Legal') {
                    selectedDepartment = 2
                } else if (answer.departmentId === 'Marketing') {
                    selectedDepartment = 3
                } else if (answer.departmentId === 'Accounting') {
                    selectedDepartment = 4
                } else {
                    departmentSelected = 5
                }
                query = `DELETE FROM department WHERE id = ${departmentSelected}`
               
                db.query(query, function (err, results) {
                    if (err) throw err;
                    console.table('Success on deleting the department')
                    return app.firstMenu();
                });
            });
            break;

            case 'Delete a role':
                query = `SELECT * FROM roles;`;
                    db.query(query, function (err, results) {
                    if (err) throw err;
                    console.table(results)
                
                inquirer.prompt({
                    type: 'input',
                    name: 'roleID',
                    message: "ID of the role to be deleted?"
                })
                .then((answer) => {
                    query = `DELETE FROM roles WHERE id = ${answer.roleID}`
                    
                    db.query(query, function (err, results) {
                        if (err) throw err;
                        console.table('Role deleted Succesfully')
                        return app.firstMenu();
                       
                        });
                
                    });
              
                });

                break;
            case 'Delete an employee':
                query = `SELECT * FROM employee;`;
                    db.query(query, function (err, results) {
                    if (err) throw err;
                    console.table(results)
               
                inquirer.prompt({
                    type: 'input',
                    name: 'employeeID',
                    message: "ID of employee to be Deleted?"
                })
                .then((answer) => {
                    query = `DELETE FROM roles WHERE id = ${answer.employeeID}`
                    // const params = answer.nameofRole;
                    db.query(query, function (err, results) {
                        if (err) throw err;
                        console.table('Eployee deleted succesfully')
                        return app.firstMenu();
                      
                        });
                  
                    });
                
                });
                break;
            default:
                console.log('There was an error')
                break;
        }
    }
    
    // modules being export 
    
    module.exports = {
        showInfo: showInfo,
        add: add,
        update: update,
        deleteOption: deleteOption
          
}
