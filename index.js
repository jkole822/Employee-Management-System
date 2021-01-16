const inquirer = require("inquirer");
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

	runSearch();
});

const runSearch = () => {
	inquirer
		.prompt({
			name: "action",
			type: "list",
			message: "What would you like to do?",
			choices: [
				"View all employees",
				"View all employees by department",
				"View all employees by manager",
				"Add employee",
				"Remove employee",
				"Update employee role",
				"Update employee manager",
				"View all roles",
				"Add role",
				"Remove role",
				"View all departments",
				"Add department",
				"Remove department",
			],
		})
		.then(answer => {
			switch (answer.action) {
				case "View all employees":
					viewEmployees();
					break;
				case "View all employees by department":
					viewByDept();
					break;
				case "View all employees by manager":
					viewByManager();
					break;
				case "Add employee":
					addEmployee();
					break;
				case "Remove employee":
					removeEmployee();
					break;
				case "Update employee role":
					updateRole();
					break;
				case "Update employee manager":
					updateManager();
					break;
				case "View all roles":
					break;
				case "Add role":
					break;
				case "Remove role":
					break;
				case "View all departments":
					break;
				case "Add department":
					break;
				case "Remove department":
					break;
				case "Exit":
					break;
			}
		});
};

const viewEmployees = (type, answer) => {
	let query =
		"SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', title AS Title, ";
	query +=
		"salary AS Salary, name AS Department, CONCAT(m.first_name, ' ', m.last_name) AS Manager ";
	query += "FROM employee e ";
	query += "INNER JOIN role ON e.role_id = role.id ";
	query += "INNER JOIN department ON role.department_id = department.id ";
	query += "LEFT JOIN employee m ON e.manager_id = m.id ";

	if (type === "department") {
		query += "WHERE department.name = ? ";
	}

	if (type === "manager") {
		query += "WHERE CONCAT(m.first_name, ' ', m.last_name) = ? ";
	}

	query += "ORDER BY e.id ASC";

	connection.query(query, answer, (err, res) => {
		if (err) {
			return console.log(err);
		}
		console.table(res);

		runSearch();
	});
};

const viewByDept = () => {
	connection.query("SELECT name FROM department", (err, res) => {
		if (err) {
			return console.log(err);
		}

		const choices = res.map(department => department.name);

		inquirer
			.prompt({
				name: "department",
				type: "list",
				message: "View by which department?",
				choices,
			})
			.then(answer => {
				viewEmployees("department", answer.department);
			});
	});
};

const viewByManager = () => {
	let query = "SELECT CONCAT(first_name, ' ', last_name) AS name ";
	query += "FROM employee ";
	query += "INNER JOIN role ON employee.role_id = role.id ";
	query += "WHERE role.title LIKE '%Lead%'";

	connection.query(query, (err, res) => {
		if (err) {
			return console.log(err);
		}

		const choices = res.map(manager => manager.name);

		inquirer
			.prompt({
				name: "manager",
				type: "list",
				message: "View by which manager?",
				choices,
			})
			.then(answer => {
				viewEmployees("manager", answer.manager);
			});
	});
};

const addEmployee = () => {
	connection.query("SELECT id, title FROM role", (err, res) => {
		if (err) {
			return console.log(err);
		}

		const roles = res.map(role => {
			return { id: role.id, title: role.title };
		});

		const roleChoices = res.map(role => role.title);

		let query =
			"SELECT employee.id, CONCAT(first_name, ' ', last_name) AS name ";
		query += "FROM employee ";
		query += "INNER JOIN role ON employee.role_id = role.id ";
		query += "WHERE role.title LIKE '%Lead%'";

		connection.query(query, (err, res) => {
			if (err) {
				return console.log(err);
			}

			const noManager = { id: 0, name: "No Manager" };

			const managersOne = res.map(manager => {
				return { id: manager.id, name: manager.name };
			});

			const managersTwo = [...managersOne, noManager];

			const managerChoicesOne = res.map(manager => manager.name);

			const managerChoicesTwo = [...managerChoicesOne, "No Manager"];

			inquirer
				.prompt([
					{
						name: "firstName",
						type: "input",
						message: "First name: ",
					},
					{
						name: "lastName",
						type: "input",
						message: "Last name: ",
					},
					{
						name: "role",
						type: "list",
						message: "Role: ",
						choices: roleChoices,
					},
					{
						name: "manager",
						type: "list",
						message: "Manager: ",
						choices: managerChoicesTwo,
					},
				])
				.then(answer => {
					const role = roles.find(role => role.title === answer.role);
					const roleId = role.id;
					const manager = managersTwo.find(
						manager => manager.name === answer.manager
					);
					const managerId = manager.id;
					const employee = {
						first_name: answer.firstName.trim(),
						last_name: answer.lastName.trim(),
						role_id: roleId,
					};

					if (managerId !== 0) {
						employee[manager_id] = managerId;
					}

					let query = "INSERT INTO employee SET ?";

					connection.query(query, employee, (err, res) => {
						if (err) {
							return console.log(err);
						}

						console.log(res);

						runSearch();
					});
				});
		});
	});
};

const removeEmployee = () => {
	let query = "SELECT id, CONCAT(first_name, ' ', last_name) AS name ";
	query += "FROM employee ";

	connection.query(query, (err, res) => {
		if (err) {
			return console.log(err);
		}

		const employees = res.map(employee => {
			return { id: employee.id, name: employee.name };
		});
		const choices = res.map(employee => employee.name);

		inquirer
			.prompt({
				name: "employee",
				type: "list",
				message: "Which employee do you want to remove?",
				choices,
			})
			.then(answer => {
				const employee = employees.find(
					employee => employee.name === answer.employee
				);
				const employeeId = employee.id;

				connection.query(
					"DELETE FROM employee WHERE id = ?",
					employeeId,
					(err, res) => {
						if (err) {
							return console.log(err);
						}

						console.log(res);

						runSearch();
					}
				);
			});
	});
};

const updateRole = () => {
	let query = "SELECT employee.id, CONCAT(first_name, ' ', last_name) AS name ";
	query += "FROM employee ";

	connection.query(query, (err, res) => {
		if (err) {
			return console.log(err);
		}

		const employees = res.map(employee => {
			return { id: employee.id, name: employee.name };
		});
		const employeeChoices = res.map(employee => employee.name);

		connection.query("SELECT id, title FROM role", (err, res) => {
			if (err) {
				return console.log(err);
			}

			const roles = res.map(role => {
				return { id: role.id, title: role.title };
			});

			const roleChoices = res.map(role => role.title);

			inquirer
				.prompt([
					{
						name: "employee",
						type: "list",
						message: "Which employee would you like to update?",
						choices: employeeChoices,
					},
					{
						name: "role",
						type: "list",
						message: "Which role should they be assigned?",
						choices: roleChoices,
					},
				])
				.then(answer => {
					const employee = employees.find(
						employee => employee.name === answer.employee
					);
					const employeeId = employee.id;
					const role = roles.find(role => role.title === answer.role);
					const roleId = role.id;

					connection.query(
						"UPDATE employee SET role_id = ? WHERE id = ?",
						[roleId, employeeId],
						(err, res) => {
							if (err) {
								return console.log(err);
							}

							console.log(res);

							runSearch();
						}
					);
				});
		});
	});
};

const updateManager = () => {
	let query = "SELECT employee.id, CONCAT(first_name, ' ', last_name) AS name ";
	query += "FROM employee ";
	query += "INNER JOIN role ON employee.role_id = role.id ";
	query += "WHERE role.title NOT LIKE '%Lead%'";

	connection.query(query, (err, res) => {
		if (err) {
			return console.log(err);
		}

		const employees = res.map(employee => {
			return { id: employee.id, name: employee.name };
		});
		const employeeChoices = res.map(employee => employee.name);

		let query =
			"SELECT employee.id, CONCAT(first_name, ' ', last_name) AS name ";
		query += "FROM employee ";
		query += "INNER JOIN role ON employee.role_id = role.id ";
		query += "WHERE role.title LIKE '%Lead%'";

		connection.query(query, (err, res) => {
			if (err) {
				return console.log(err);
			}

			const noManager = { id: 0, name: "No Manager" };

			const managersOne = res.map(manager => {
				return { id: manager.id, name: manager.name };
			});

			const managersTwo = [...managersOne, noManager];

			const managerChoicesOne = res.map(manager => manager.name);

			const managerChoicesTwo = [...managerChoicesOne, "No Manager"];

			inquirer
				.prompt([
					{
						name: "employee",
						type: "list",
						message: "Which employee would you like to update?",
						choices: employeeChoices,
					},
					{
						name: "manager",
						type: "list",
						message: "Which manager should they be assigned?",
						choices: managerChoicesTwo,
					},
				])
				.then(answer => {
					const employee = employees.find(
						employee => employee.name === answer.employee
					);
					const employeeId = employee.id;
					const manager = managersTwo.find(
						manager => manager.name === answer.manager
					);
					const managerId = manager.id;

					if (managerId === 0) {
						connection.query(
							"UPDATE employee SET manager_id = null WHERE id = ?",
							employeeId,
							(err, res) => {
								if (err) {
									return console.log(err);
								}

								console.log(res);

								runSearch();
							}
						);
					} else {
						connection.query(
							"UPDATE employee SET manager_id = ? WHERE id = ?",
							[managerId, employeeId],
							(err, res) => {
								if (err) {
									return console.log(err);
								}

								console.log(res);

								runSearch();
							}
						);
					}
				});
		});
	});
};
