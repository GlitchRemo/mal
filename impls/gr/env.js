const { MalNil, MalVector, MalList } = require("./types");

class Env {
  #outer;
  #binds;
  #exprs;
  #data;

  constructor({ outer, binds = [], exprs = [] }) {
    this.#outer = outer;
    this.#binds = binds;
    this.#exprs = exprs;
    this.#data = {};
    this.#bind_exprs();
  }

  #bind_exprs() {
    for (let i = 0; i < this.#binds.length; i++) {
      if (this.#binds[i].value === "&") {
        this.set(this.#binds[i + 1].value, new MalList(this.#exprs.slice(i)));
        return;
      }

      this.set(this.#binds[i].value, this.#exprs[i]);
    }
  }

  set(key, value) {
    this.#data[key] = value;
  }

  find(key) {
    if (this.#data[key]) return this;

    return this.#outer instanceof MalNil ? new MalNil() : this.#outer.find(key);
  }

  get(key) {
    if (this.find(key) instanceof MalNil) throw new Error(`${key} not found`);

    return this.find(key).#data[key];
  }
}

module.exports = { Env };
