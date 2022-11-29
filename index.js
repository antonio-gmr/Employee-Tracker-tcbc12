const inquirer = require('inquirer');
const db = require('./database')

// Display principal menu
const firstMenu = () => {
    inquirer.prompt({
        type: 'list',
        name: 'principalMenu',
        message: 'What would you like to do?',
        choices: ['View', 'Add', 'Update', 'Delete', 'Exit']
    })
    .then((answer) => {
        switch(answer.principalMenu) {
            // View option
            case 'View':
                displayMenu();
                break;
            // Add option
            case 'Add':
                add();
                break;
            // Update option
            case 'Update':
                update();
                break;
            // Delete option
            case 'Delete':
                deleteDatabase();
                break;
            default:
                process.exit();
        }
    });
};




// Menu 

const displayMenu = () => {
    inquirer.prompt({
        type: 'list',
        name: 'viewMenu',
        message: 'Viewing',
        choices: ['All Departments', 
                  'All Roles', 
                  'All Employees',
                  'Employees by Department',
                  'Employees by Manager',
                  'Budget of a Department',
                   '<< Go Back']
    })
    .then((answer) => {
        if (answer.viewMenu === '<< Go Back'){return firstMenu();}
        db.showInfo(answer.viewMenu)
    });
}

// add 

const add = () => {
    inquirer.prompt({
type: 'list',
name: 'addtodatabase',
message: 'showing',
choices: ['Department', 'Role', 'Employee', '<= return']
    })
    .then ((answer) => {
        if (answer.addtodatabase === "<= return") { return firstMenu();}
        db.add(answer.addtodatabase)
    });

}



// update 

const update = () => {
    inquirer.prompt({
        type: 'list',
        name: 'updateTable',
        message: 'viewing',
        choices: ['Update an Employee Role', 'Update an Employee Manager', '<< Go Back']
    })
    .then((answer) => {
        if (answer.updateTable === '<< Go Back'){return firstMenu();}
        db.update(answer.updateTable)
    });
};


// delete 

const deleteDatabase = () => {
    inquirer.prompt({
type: 'list',
name: 'delete',
message: 'showing',
choices: ['Delete a department', 'Delete a role', 'Delete an Employee', '<= return']
    })
    .then ((answer) => {
        if (answer.delete === "<= return") { return firstMenu();}
        db.deleteOption(answer.delete)
    });

}

// calling the menu 

firstMenu(); 

module.exports.firstMenu = firstMenu;
