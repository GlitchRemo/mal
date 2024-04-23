const { MalType } = require("./types");

const pr_str = (value) => (value instanceof MalType ? value.pr_str() : value);

module.exports = { pr_str };
