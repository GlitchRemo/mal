const { Env } = require("./env");
const {
  MalSymbol,
  MalList,
  MalNumber,
  MalVector,
  MalMap,
  MalNil,
  MalFunction,
} = require("./types");
const { chunk } = require("./utils");

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) return env.get(ast.value);

  if (ast instanceof MalNumber) return new MalNumber(ast.value);

  if (ast instanceof MalList)
    return new MalList(ast.value.map((e) => EVAL(e, env)));

  if (ast instanceof MalVector)
    return new MalVector(ast.value.map((e) => EVAL(e, env)));

  if (ast instanceof MalMap)
    return new MalMap(ast.value.map(([k, v]) => [k, EVAL(v, env)]));

  if (ast instanceof MalFunction) return ast.value;

  return ast;
};

const handleDef = (args, env) => {
  env.set(args[0].value, EVAL(args[1], env));
  return env.get(args[0].value);
};

const handleDo = (args, env) => {
  const evaluatedList = eval_ast(new MalList(args), env);
  return evaluatedList.value.at(-1);
};

const handleLet = (args, oldEnv) => {
  const env = new Env({ outer: oldEnv });
  const [bindings, ...body] = args;

  chunk(bindings.value, 2).forEach(([k, v]) => env.set(k.value, EVAL(v, env)));

  return body ? handleDo(body, env) : new MalNil();
};

const handleIf = (args, env) => {
  const [condition, then, otherwise] = args;

  return EVAL(condition, env).value
    ? EVAL(then, env)
    : otherwise
    ? EVAL(otherwise, env)
    : new MalNil();
};

const handleFn = (args, env) => {
  const [bindings, ...body] = args;

  const fnClosure = (...params) => {
    const newEnv = new Env({
      outer: env,
      binds: bindings.value,
      exprs: params,
    });

    newEnv.bind_exprs();

    return handleDo(body, newEnv);
  };

  return new MalFunction(fnClosure);
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

      case "do":
      case "DO":
        return handleDo(args, env);

      case "if":
        return handleIf(args, env);

      case "fn*":
        return handleFn(args, env);

      default: {
        const [fn, ...args] = eval_ast(ast, env).value;
        return fn.value.apply(null, args);
      }
    }
  }

  return eval_ast(ast, env);
};

module.exports = { eval_ast, EVAL };
