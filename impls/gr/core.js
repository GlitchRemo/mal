const { Env } = require("./env");
const fs = require("fs");
const { read_str } = require("./reader");
const {
  MalNumber,
  MalBoolean,
  MalNil,
  MalList,
  MalString,
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
  "list?": (arg) => new MalBoolean(arg instanceof MalList),
  "empty?": (arg) => new MalBoolean(arg.value.length === 0),
  count: (arg) => (arg instanceof MalNil ? 0 : new MalNumber(arg.value.length)),
  prn: (...args) => {
    console.log(args.map((e) => e.pr_str()).join(" "));
    return new MalNil();
  },
  str: (...args) => new MalString(args.map((e) => e.pr_str()).join("")),
  "read-string": (str) => read_str(str.value),
  slurp: (fileName) =>
    new MalString(fs.readFileSync(fileName.value.replaceAll('"', ""), "utf-8")),
};

const create_and_load_env = () => {
  const repl_env = new Env({ outer: new MalNil() });

  Object.entries(ns).map(([symbol, handler]) => repl_env.set(symbol, handler));

  return repl_env;
};

module.exports = { create_and_load_env };
