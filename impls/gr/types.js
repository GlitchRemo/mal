class MalType {
  value;
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value;
  }

  equals(other) {
    return this.value === other.value;
  }
}

class MalEnclosure extends MalType {
  pr_str(opening_symbol, closing_symbol) {
    return (
      opening_symbol +
      this.value.map((e) => (e instanceof MalType ? e.pr_str() : e)).join(" ") +
      closing_symbol
    );
  }

  equals(other) {
    return (
      this.value.length === other.value.length &&
      this.value.every((e, i) => e.equals(other.value[i]))
    );
  }
}

class MalSymbol extends MalType {
  pr_str() {
    return super.pr_str().toString();
  }
}

class MalKeyword extends MalType {
  pr_str() {
    return `:${this.value}`;
  }
}

class MalNumber extends MalType {}

class MalNil extends MalType {
  constructor() {
    super(false);
  }

  pr_str() {
    return "nil";
  }
}

class MalBoolean extends MalType {
  pr_str() {
    return super.pr_str().toString();
  }
}

class MalList extends MalEnclosure {
  pr_str() {
    return super.pr_str("(", ")");
  }
}

class MalVector extends MalEnclosure {
  pr_str() {
    return super.pr_str("[", "]");
  }
}

class MalMap extends MalType {
  pr_str() {
    return `{${this.value
      .map(([k, v]) => k.pr_str() + " " + v.pr_str())
      .join(" ")}}`;
  }

  equals(other) {
    return (
      this.value.length === other.value.length &&
      this.value.every(
        ([k, v], i) =>
          k.equals(other.value[i][0]) && v.equals(other.value[i][1])
      )
    );
  }
}

class MalString extends MalType {
  pr_str() {
    return super.pr_str().trim();
  }
}

class MalFunction extends MalType {
  bindings;
  body;
  env;

  constructor({ bindings, body, env }) {
    super();
    this.bindings = bindings;
    this.body = body;
    this.env = env;
  }

  pr_str() {
    return "#<function>";
  }
}

module.exports = {
  MalType,
  MalNumber,
  MalList,
  MalVector,
  MalString,
  MalNil,
  MalBoolean,
  MalSymbol,
  MalMap,
  MalFunction,
  MalKeyword,
};
