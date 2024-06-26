const {
  MalNumber,
  MalList,
  MalVector,
  MalString,
  MalBoolean,
  MalNil,
  MalSymbol,
  MalMap,
  MalKeyword,
} = require("./types");
const { chunk } = require("./utils");

class Reader {
  #tokens;
  #position;

  constructor(tokens) {
    this.#tokens = tokens;
    this.#position = 0;
  }

  peek() {
    return this.#tokens[this.#position];
  }

  next() {
    const current_value = this.peek();
    this.#position++;
    return current_value;
  }
}

const tokenize = (string) => {
  const regex =
    /[\s,]*(~@|[[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s[\]{}('"`,;)]*)/g;

  return [...string.matchAll(regex)].slice(0, -1).map((x) => x[1]);
};

const read_atom = (reader) => {
  const token = reader.next();

  if (token.match(/^[-|+]?\d+$/)) return new MalNumber(parseInt(token));

  if (token.match(/^".*"$/)) return new MalString(token);

  if (token[0] === '"') throw new Error("unbalanced");

  if (token === "true") return new MalBoolean(true);

  if (token === "false") return new MalBoolean(false);

  if (token === "nil") return new MalNil();

  if (token[0] === ":") return new MalKeyword(token.slice(1));

  return new MalSymbol(token);
};

const read_seq = (reader, closing_symbol) => {
  const ast = [];

  while (reader.peek() !== closing_symbol) {
    if (!reader.peek()) throw new Error("unbalanced");

    ast.push(read_form(reader));
  }

  reader.next();
  return ast;
};

const read_list = (reader) => new MalList(read_seq(reader, ")"));

const read_vector = (reader) => new MalVector(read_seq(reader, "]"));

const read_map = (reader) => {
  const ast = read_seq(reader, "}");
  const chunkedAst = chunk(ast, 2);

  return new MalMap(chunkedAst);
};

const read_form = (reader) => {
  const token = reader.peek();

  switch (token) {
    case "(":
      reader.next();
      return read_list(reader);

    case "[":
      reader.next();
      return read_vector(reader);

    case "{":
      reader.next();
      return read_map(reader);

    default:
      return read_atom(reader);
  }
};

const read_str = (string) => {
  const tokens = tokenize(string);
  const reader = new Reader(tokens);
  return read_form(reader);
};

module.exports = { read_str };
