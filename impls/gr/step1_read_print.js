const readline = require("node:readline");
const { read_str } = require("./reader");
const { stdin: input, stdout: output } = require("node:process");

const rl = readline.createInterface({ input, output });

const repl = () => {
  rl.question("user> ", (answer) => {
    try {
      console.log(read_str(answer).pr_str());
    } catch (err) {
      console.log(err);
    }
    repl();
  });
};

repl();
