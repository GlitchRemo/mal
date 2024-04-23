const { MalSymbol, MalList, MalNumber, MalVector } = require("./types");

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol && !env[ast.value])
    throw new Error("Invalid symbol");

  if (ast instanceof MalSymbol) return env[ast.value];

  if (ast instanceof MalNumber) return new MalNumber(ast.value);

  if (ast instanceof MalList)
    return new MalList(ast.value.map((e) => EVAL(e, env)));

  if (ast instanceof MalVector)
    return new MalVector(ast.value.map((e) => EVAL(e, env)));

  return ast;
};

const EVAL = (ast, env) => {
  if (ast.value.length === 0) return ast;

  if (ast instanceof MalList) {
    const [fn, ...args] = eval_ast(ast, env).value;
    return fn.apply(
      null,
      args.map((e) => e.value)
    );
  }

  return eval_ast(ast, env);
};

module.exports = { eval_ast, EVAL };
