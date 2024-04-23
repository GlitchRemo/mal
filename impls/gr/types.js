class MalSymbol {
  #value;
  constructor(value) {
    this.#value = value;
  }

  pr_str() {
    return this.#value.toString();
  }
}

class MalNumber {
  #value;
  constructor(value) {
    this.#value = value;
  }

  pr_str() {
    return this.#value;
  }
}

class MalNil {
  pr_str() {
    return "nil";
  }
}

class MalBoolean {
  #value;
  constructor(value) {
    this.#value = value;
  }

  pr_str() {
    return this.#value;
  }
}

class MalList {
  #value;

  constructor(value) {
    this.#value = value;
  }

  pr_str() {
    return `(${this.#value.map((e) => e.pr_str()).join(" ")})`;
  }
}

class MalVector {
  #value;
  constructor(value) {
    this.#value = value;
  }

  pr_str() {
    return `[${this.#value.map((e) => e.pr_str()).join(" ")}]`;
  }
}

class MalString {
  #value;
  constructor(value) {
    this.#value = value;
  }

  pr_str() {
    return this.#value.trim();
  }
}

module.exports = {
  MalNumber,
  MalList,
  MalVector,
  MalString,
  MalNil,
  MalBoolean,
  MalSymbol,
};
