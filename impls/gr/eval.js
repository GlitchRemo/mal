const { log } = require("console");
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

const handleDef = (args, env) => {
  env.set(args[0].value, EVAL(args[1], env));
  return env.get(args[0].value);
};

const handleDo = (args, env) => {
  eval_ast(new MalList(args.slice(0, -1)), env);
  return args.at(-1);
};

const handleLet = (args, oldEnv) => {
  const env = new Env({ outer: oldEnv });
  const [bindings, ...body] = args;

  chunk(bindings.value, 2).forEach(([k, v]) => env.set(k.value, EVAL(v, env)));

  return body ? handleDo(body, env) : new MalNil();
};

const handleIf = (args, env) => {
  const [condition, then, otherwise] = args;
  const evaluatedCondition = EVAL(condition, env);

  return evaluatedCondition instanceof MalNil ||
    evaluatedCondition.value === false
    ? otherwise
    : then;
};

const handleFn = (args, env) => {
  const [bindings, ...body] = args;

  return new MalFunction({
    bindings,
    body: new MalList([new MalSymbol("do"), ...body]),
    env,
  });
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

  if (ast instanceof MalFunction) return ast.value;

  return ast;
};

const EVAL = (ast, env) => {
  while (true) {
    if (ast.value?.length === 0) return ast;

    if (ast instanceof MalList) {
      const [symbol, ...args] = ast.value;

      switch (symbol.value) {
        case "def!":
          return handleDef(args, env);

        case "let*":
          return handleLet(args, env);

        case "do":
        case "DO":
          ast = handleDo(args, env);
          continue;

        case "if":
          ast = handleIf(args, env);
          continue;

        case "fn*":
          return handleFn(args, env);

        default: {
          const [fn, ...args] = eval_ast(ast, env).value;

          if (fn instanceof MalFunction) {
            env = new Env({
              outer: env,
              binds: fn.bindings.value,
              exprs: args,
            });

            ast = fn.body;
            continue;
          }

          return fn(...args);
        }
      }
    }

    return eval_ast(ast, env);
  }
};

module.exports = { eval_ast, EVAL };
