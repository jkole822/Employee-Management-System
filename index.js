const database = require("./database");
const {
	runSearchPrompt,
	viewByDeptPrompt,
	viewByManagerPrompt,
	addEmployeePrompt,
	removeEmployeePrompt,
	updateRolePrompt,
	updateManagerPrompt,
	addRolePrompt,
	removeRolePrompt,
	addDepartmentPrompt,
	removeDepartmentPrompt,
} = require("./CLI.js");

const runSearch = async () => {
	const answer = await runSearchPrompt();

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
			viewRoles();
			break;
		case "Add role":
			addRole();
			break;
		case "Remove role":
			removeRole();
			break;
		case "View all departments":
			viewDepartments();
			break;
		case "Add department":
			addDepartment();
			break;
		case "Remove department":
			removeDepartment();
			break;
	}
};

const viewEmployees = async (type, answer) => {
	try {
		console.table(await database.viewEmployees(type, answer));
		runSearch();
	} catch (err) {
		throw err;
	}
};

const viewByDept = async () => {
	try {
		const query = await database.getDepartments();

		const choices = query.map(department => department.name);

		const answer = await viewByDeptPrompt(choices);

		viewEmployees("department", answer.department);
	} catch (err) {
		throw err;
	}
};

const viewByManager = async () => {
	try {
		const query = await database.getManagers();

		const choices = query.map(manager => manager.name);

		const answer = await viewByManagerPrompt(choices);

		viewEmployees("manager", answer.manager);
	} catch (err) {
		throw err;
	}
};

const addEmployee = async () => {
	try {
		const roleQuery = await database.getRoles();
		const managerQuery = await database.getManagers();

		const roles = roleQuery.map(role => {
			return { id: role.id, title: role.title };
		});

		const roleChoices = roleQuery.map(role => role.title);

		const managers = [
			...managerQuery.map(manager => {
				return { id: manager.id, name: manager.name };
			}),
			{ id: 0, name: "No Manager" },
		];

		const managerChoices = [
			...managerQuery.map(manager => manager.name),
			"No Manager",
		];

		const answer = await addEmployeePrompt(roleChoices, managerChoices);

		const role = roles.find(role => role.title === answer.role);
		const roleId = role.id;
		const manager = managers.find(manager => manager.name === answer.manager);
		const managerId = manager.id;
		const employee = {
			first_name: answer.firstName.trim(),
			last_name: answer.lastName.trim(),
			role_id: roleId,
		};

		if (managerId !== 0) {
			employee["manager_id"] = managerId;
		}

		database.addEmployee(employee);

		runSearch();
	} catch (err) {
		throw err;
	}
};

const removeEmployee = async () => {
	try {
		const query = await database.getEmployees();

		const employees = query.map(employee => {
			return { id: employee.id, name: employee.name };
		});

		const choices = query.map(employee => employee.name);

		const answer = await removeEmployeePrompt(choices);

		const employee = employees.find(
			employee => employee.name === answer.employee
		);

		const employeeId = employee.id;

		database.deleteEmployee(employeeId);

		runSearch();
	} catch (err) {
		throw err;
	}
};

const updateRole = async () => {
	try {
		const employeeQuery = await database.getEmployees();
		const roleQuery = await database.getRoles();

		const employees = employeeQuery.map(employee => {
			return { id: employee.id, name: employee.name };
		});
		const employeeChoices = employeeQuery.map(employee => employee.name);

		const roles = roleQuery.map(role => {
			return { id: role.id, title: role.title };
		});

		const roleChoices = roleQuery.map(role => role.title);

		const answer = await updateRolePrompt(employeeChoices, roleChoices);

		const employee = employees.find(
			employee => employee.name === answer.employee
		);
		const employeeId = employee.id;
		const role = roles.find(role => role.title === answer.role);
		const roleId = role.id;

		database.updateEmployeeRole(roleId, employeeId);

		runSearch();
	} catch (err) {
		throw err;
	}
};

const updateManager = async () => {
	try {
		const employeeQuery = await database.getNonManagers();
		const managerQuery = await database.getManagers();

		const employees = employeeQuery.map(employee => {
			return { id: employee.id, name: employee.name };
		});
		const employeeChoices = employeeQuery.map(employee => employee.name);

		const managers = [
			...managerQuery.map(manager => {
				return { id: manager.id, name: manager.name };
			}),
			{ id: 0, name: "No Manager" },
		];

		const managerChoices = [
			...managerQuery.map(manager => manager.name),
			"No Manager",
		];

		const answer = await updateManagerPrompt(employeeChoices, managerChoices);

		const employee = employees.find(
			employee => employee.name === answer.employee
		);
		const employeeId = employee.id;
		const manager = managers.find(manager => manager.name === answer.manager);
		const managerId = manager.id;

		if (managerId === 0) {
			database.updateEmployeeManager(null, employeeId);
		} else {
			database.updateEmployeeManager(managerId, employeeId);
		}

		runSearch();
	} catch (err) {
		throw err;
	}
};

const viewRoles = async () => {
	try {
		console.table(await database.viewRoles());
		runSearch();
	} catch (err) {
		throw err;
	}
};

const addRole = async () => {
	try {
		const query = await database.getDepartments();

		const departments = query.map(department => {
			return {
				id: department.id,
				name: department.name,
			};
		});

		const choices = query.map(department => department.name);

		const answer = await addRolePrompt(choices);

		const department = departments.find(
			department => department.name === answer.department
		);
		const departmentId = department.id;
		const role = {
			title: answer.title.trim(),
			salary: answer.salary.trim(),
			department_id: departmentId,
		};

		database.addRole(role);

		runSearch();
	} catch (err) {
		throw err;
	}
};

const removeRole = async () => {
	try {
		const query = await database.getRoles();

		const roles = query.map(role => {
			return { id: role.id, title: role.title };
		});
		const choices = query.map(role => role.title);

		const answer = await removeRolePrompt(choices);

		const role = roles.find(role => role.title === answer.role);
		const roleId = role.id;

		database.deleteRole(roleId);

		runSearch();
	} catch (err) {
		throw err;
	}
};

const viewDepartments = async () => {
	try {
		console.table(await database.viewDepartments());
		runSearch();
	} catch (err) {
		throw err;
	}
};

const addDepartment = async () => {
	try {
		const answer = await addDepartmentPrompt();

		database.addDepartment(answer.name);

		runSearch();
	} catch (err) {
		throw err;
	}
};

const removeDepartment = async () => {
	try {
		const query = await database.getDepartments();

		const departments = query.map(department => {
			return { id: department.id, name: department.name };
		});

		const choices = query.map(department => department.name);

		const answer = await removeDepartmentPrompt(choices);

		const department = departments.find(
			department => department.name === answer.department
		);
		const departmentId = department.id;

		database.deleteDepartment(departmentId);

		runSearch();
	} catch (err) {
		throw err;
	}
};

runSearch();
