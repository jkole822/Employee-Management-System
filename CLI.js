const util = require("util");
const inquirer = require("inquirer");

const runSearchPrompt = () => {
	return inquirer.prompt({
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
	});
};

const viewByDeptPrompt = choices => {
	return inquirer.prompt({
		name: "department",
		type: "list",
		message: "View by which department?",
		choices,
	});
};

const viewByManagerPrompt = choices => {
	return inquirer.prompt({
		name: "manager",
		type: "list",
		message: "View by which manager?",
		choices,
	});
};

const addEmployeePrompt = (roleChoices, managerChoices) => {
	return inquirer.prompt([
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
			choices: managerChoices,
		},
	]);
};

const removeEmployeePrompt = choices => {
	return inquirer.prompt({
		name: "employee",
		type: "list",
		message: "Which employee do you want to remove?",
		choices,
	});
};

const updateRolePrompt = (employeeChoices, roleChoices) => {
	return inquirer.prompt([
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
	]);
};

const updateManagerPrompt = (employeeChoices, managerChoices) => {
	return inquirer.prompt([
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
			choices: managerChoices,
		},
	]);
};

const addRolePrompt = choices => {
	return inquirer.prompt([
		{
			name: "title",
			type: "input",
			message: "Title: ",
		},
		{
			name: "salary",
			type: "input",
			message: "Salary: ",
		},
		{
			name: "department",
			type: "list",
			message: "Department: ",
			choices,
		},
	]);
};

const removeRolePrompt = choices => {
	return inquirer.prompt({
		name: "role",
		type: "list",
		message: "Which role do you want to remove?",
		choices,
	});
};

const addDepartmentPrompt = () => {
	return inquirer.prompt({
		name: "name",
		type: "input",
		message: "Name: ",
	});
};

const removeDepartmentPrompt = choices => {
	return inquirer.prompt({
		name: "department",
		type: "list",
		message: "Which department do you want to remove?",
		choices,
	});
};

module.exports = {
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
};
