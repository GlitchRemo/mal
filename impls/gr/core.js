const { Env } = require("./env");
const {
  MalNumber,
  MalBoolean,
  MalFunction,
  MalNil,
  MalList,
  isEnclosure,
} = require("./types");

const ns = {
  "+": (a, b) => new MalNumber(a.value + b.value),
  "-": (a, b) => new MalNumber(a.value - b.value),
  "*": (a, b) => new MalNumber(a.value * b.value),
  "/": (a, b) => new MalNumber(a.value / b.value),
  ">": (a, b) => new MalBoolean(a.value > b.value),
  "<": (a, b) => new MalBoolean(a.value < b.value),
  "<=": (a, b) => new MalBoolean(a.value <= b.value),
  ">=": (a, b) => new MalBoolean(a.value >= b.value),
  "=": (a, b) => new MalBoolean(a.equals(b)),
  list: (...args) => new MalList(args),
  "list?": (...args) => args[0] instanceof MalList,
  "empty?": (...args) => isEnclosure(args[0]) && !args[0].value.length,
  count: (...args) => isEnclosure(args[0]) && args[0].value.length,
  prn: (...args) => {
    console.log(args.map((e) => e.pr_str()).join(" "));
    return new MalNil();
  },
};

const create_global_env = () => {
  const repl_env = new Env({ outer: new MalNil() });

  Object.entries(ns).map(([symbol, handler]) =>
    repl_env.set(symbol, new MalFunction(handler))
  );

  return repl_env;
};

module.exports = { create_global_env };
