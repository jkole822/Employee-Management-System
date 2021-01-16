const util = require("util");
const mysql = require("mysql");

// MySQL DB Connection Information
const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "rootpass",
	database: "employee_tracker",
});

// Initiate MySQL Connection.
connection.connect(err => {
	if (err) {
		return console.error(`error connecting: ${err.stack}`);
	}
	console.log(`connected as id ${connection.threadId}`);
});

const query = util.promisify(connection.query.bind(connection));

class DB {
	viewEmployees(type, answer) {
		let searchQuery =
			"SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', title AS Title, ";
		searchQuery +=
			"salary AS Salary, name AS Department, CONCAT(m.first_name, ' ', m.last_name) AS Manager ";
		searchQuery += "FROM employee e ";
		searchQuery += "INNER JOIN role ON e.role_id = role.id ";
		searchQuery +=
			"INNER JOIN department ON role.department_id = department.id ";
		searchQuery += "LEFT JOIN employee m ON e.manager_id = m.id ";

		if (type === "department") {
			searchQuery += "WHERE department.name = ? ";
		}

		if (type === "manager") {
			searchQuery += "WHERE CONCAT(m.first_name, ' ', m.last_name) = ? ";
		}

		searchQuery += "ORDER BY e.id ASC";

		return query(searchQuery, answer);
	}

	viewRoles() {
		let searchQuery =
			"SELECT title AS Title, salary AS Salary, name AS Department ";
		searchQuery += "FROM role ";
		searchQuery +=
			"INNER JOIN department ON role.department_id = department.id ";

		return query(searchQuery);
	}

	viewDepartments() {
		const searchQuery = "SELECT name AS Department FROM department";
		return query(searchQuery);
	}

	getEmployees() {
		let searchQuery = "SELECT id, CONCAT(first_name, ' ', last_name) AS name ";
		searchQuery += "FROM employee ";

		return query(searchQuery);
	}

	getManagers() {
		let searchQuery =
			"SELECT employee.id, CONCAT(first_name, ' ', last_name) AS name ";
		searchQuery += "FROM employee ";
		searchQuery += "INNER JOIN role ON employee.role_id = role.id ";
		searchQuery += "WHERE role.title LIKE '%Lead%'";

		return query(searchQuery);
	}

	getNonManagers() {
		let searchQuery =
			"SELECT employee.id, CONCAT(first_name, ' ', last_name) AS name ";
		searchQuery += "FROM employee ";
		searchQuery += "INNER JOIN role ON employee.role_id = role.id ";
		searchQuery += "WHERE role.title NOT LIKE '%Lead%'";

		return query(searchQuery);
	}

	getRoles() {
		return query("SELECT id, title FROM role");
	}

	getDepartments() {
		return query("SELECT id, name FROM department");
	}

	addEmployee(employee) {
		const insertQuery = "INSERT INTO employee SET ?";
		return query(insertQuery, employee);
	}

	addRole(role) {
		const insertQuery = "INSERT INTO role SET ?";
		return query(insertQuery, role);
	}

	addDepartment(department) {
		const insertQuery = "INSERT INTO department (name) VALUES (?)";
		return query(insertQuery, department);
	}

	updateEmployeeRole(roleId, employeeId) {
		const updateQuery = "UPDATE employee SET role_id = ? WHERE id = ?";
		return query(updateQuery, [roleId, employeeId]);
	}

	updateEmployeeManager(managerId, employeeId) {
		const updateQuery = "UPDATE employee SET manager_id = ? WHERE id = ?";
		return query(updateQuery, [managerId, employeeId]);
	}

	deleteEmployee(employeeId) {
		const deleteQuery = "DELETE FROM employee WHERE id = ?";
		return query(deleteQuery, employeeId);
	}

	deleteRole(roleId) {
		const deleteQuery = "DELETE FROM role WHERE id = ?";
		return query(deleteQuery, roleId);
	}

	deleteDepartment(departmentId) {
		const deleteQuery = "DELETE FROM department WHERE id = ?";
		return query(deleteQuery, departmentId);
	}
}

module.exports = new DB();
