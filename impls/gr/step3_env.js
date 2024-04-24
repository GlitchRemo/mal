const readline = require("node:readline");
const { read_str } = require("./reader");
const { stdin: input, stdout: output } = require("node:process");
const { EVAL } = require("./eval");
const { MalNumber, MalNil, MalBoolean } = require("./types");
const { pr_str } = require("./printer");
const { Env } = require("./env");

const rl = readline.createInterface({ input, output });

const repl_env = new Env({ outer: new MalNil() });
repl_env.set("+", (a, b) => new MalNumber(a + b));
repl_env.set("-", (a, b) => new MalNumber(a - b));
repl_env.set("*", (a, b) => new MalNumber(a * b));
repl_env.set("/", (a, b) => new MalNumber(a / b));
repl_env.set(">", (a, b) => new MalBoolean(a > b));
repl_env.set("<", (a, b) => new MalBoolean(a < b));
repl_env.set("<=", (a, b) => new MalBoolean(a <= b));
repl_env.set(">=", (a, b) => new MalBoolean(a >= b));

const READ = (str) => read_str(str);

const PRINT = (str) => pr_str(str);

const rep = (str) => PRINT(EVAL(READ(str), repl_env));

const repl = () => {
  rl.question("user> ", (strExpr) => {
    try {
      console.log(rep(strExpr));
    } catch (err) {
      console.log(err);
    }

    repl();
  });
};

repl();
