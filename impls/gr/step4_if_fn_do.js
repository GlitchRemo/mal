const readline = require("node:readline");
const { read_str } = require("./reader");
const { stdin: input, stdout: output } = require("node:process");
const { EVAL } = require("./eval");
const { pr_str } = require("./printer");
const { create_global_env } = require("./core");

const rl = readline.createInterface({ input, output });

const READ = (str) => read_str(str);

const PRINT = (str) => pr_str(str);

const env = create_global_env();

const rep = (str) => PRINT(EVAL(READ(str), env));
rep("(def! not (fn* (a) (if a false true)))");

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
