# Employee Tracker

![license](https://img.shields.io/static/v1?label=license&message=MIT&color=green&style=for-the-badge)

## Description

Node CLI application that enables the user to view, add, remove, and update employees, employee roles, and departments within their organization.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Technology](#technology)
- [Questions](#questions)
- [License](#license)

## Demonstration

[View Demonstration](https://drive.google.com/file/d/1AFHiHP3eBE_hvS8kcP4UEnk0SbmvJDHr/view)

## Installation

Ensure you have mySQL downloaded on your machine to run this application.

Either use a GUI or the mySQL CLI to run the schema.sql script. To start up the mySQL CLI, run `mysql -u USERNAME -pPASSWORD`. You can then run the script with `source schema.sql`. Optionally, you can seed in fake data by running `source seed.sql` after initializing the database with the former script.

## Usage

To designate a manager role, you must specify "Lead" within the role title when creating a new role.

You cannot delete a department without deleting its constituent roles, and you cannot delete a role without either reassigning employees from that role, or deleting the employees with that role.

## Technology

- Node.js
- mySQL
- Inquirer

## Questions

Please feel free to contact via email if you have any questions pertaining to this project.  
Email: jkole822@gmail.com  
[GitHub Profile](https://github.com/jkole822)

## License

[MIT](https://choosealicense.com/licenses/mit)
