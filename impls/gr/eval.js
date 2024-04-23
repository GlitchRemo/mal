const { Env } = require("./env");
const { MalSymbol, MalList, MalNumber, MalVector, MalMap } = require("./types");

const handleLet = (args, oldEnv) => {
  const env = new Env(oldEnv);
  const bindings = args[0].value;

  for (let i = 0; i < bindings.length; i += 2) {
    env.set(bindings[i].value, EVAL(bindings[i + 1], env));
  }

  return EVAL(args[1], env);
};

const handleDef = (args, env) => {
  env.set(args[0].value, EVAL(args[1], env));
  return env.get(args[0].value);
};

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) return env.get(ast.value);

  if (ast instanceof MalNumber) return new MalNumber(ast.value);

  if (ast instanceof MalList)
    return new MalList(ast.value.map((e) => EVAL(e, env)));

  if (ast instanceof MalVector)
    return new MalVector(ast.value.map((e) => EVAL(e, env)));

  if (ast instanceof MalMap)
    return new MalMap(ast.value.map(([k, v]) => [k, EVAL(v, env)]));

  return ast;
};

const EVAL = (ast, env) => {
  if (ast.value.length === 0) return ast;

  if (ast instanceof MalList) {
    const [symbol, ...args] = ast.value;

    switch (symbol.value) {
      case "def!":
        return handleDef(args, env);

      case "let*":
        return handleLet(args, env);

      default: {
        const [fn, ...args] = eval_ast(ast, env).value;
        return fn.apply(
          null,
          args.map((e) => e.value)
        );
      }
    }
  }

  return eval_ast(ast, env);
};

module.exports = { eval_ast, EVAL };
