const isEnclosure = (value) =>
  value instanceof MalList || value instanceof MalVector;

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
class MalSymbol extends MalType {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return super.pr_str().toString();
  }
}

class MalNumber extends MalType {
  constructor(value) {
    super(value);
  }
}

class MalNil extends MalType {
  constructor() {
    super(false);
  }

  pr_str() {
    return "nil";
  }
}

class MalBoolean extends MalType {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return super.pr_str().toString();
  }
}

class MalList extends MalType {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return `(${this.value.map((e) => e.pr_str()).join(" ")})`;
  }

  equals(other) {
    return (
      this.value.length === other.value.length &&
      this.value.every((e, i) => e.equals(other.value[i]))
    );
  }
}

class MalVector extends MalType {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return `[${this.value.map((e) => e.pr_str()).join(" ")}]`;
  }

  equals(other) {
    return (
      this.value.length === other.value.length &&
      this.value.every((e, i) => e.equals(other.value[i]))
    );
  }
}

class MalMap extends MalType {
  constructor(value) {
    super(value);
  }

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
  constructor(value) {
    super(value);
  }

  pr_str() {
    return super.pr_str().trim();
  }
}

class MalFunction extends MalType {
  constructor(value) {
    super(value);
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
  isEnclosure,
};
