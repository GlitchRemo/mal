const readline = require("node:readline");
const { read_str } = require("./reader");
const { stdin: input, stdout: output } = require("node:process");

const rl = readline.createInterface({ input, output });

const READ = (str) => read_str(str);
const EVAL = (str) => str;
const PRINT = (str) => str.pr_str();

const rep = (str) => PRINT(EVAL(READ(str)));

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
