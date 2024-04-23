const readline = require("node:readline");
const { read_str } = require("./reader");
const { stdin: input, stdout: output } = require("node:process");
const { EVAL } = require("./eval");
const { MalNumber } = require("./types");
const { pr_str } = require("./printer");

const rl = readline.createInterface({ input, output });

const env = {
  "+": (a, b) => new MalNumber(a + b),
  "-": (a, b) => new MalNumber(a - b),
  "*": (a, b) => new MalNumber(a * b),
  "/": (a, b) => new MalNumber(a / b),
};

const READ = (str) => read_str(str);

const PRINT = (str) => pr_str(str);

const rep = (str) => PRINT(EVAL(READ(str), env));

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
