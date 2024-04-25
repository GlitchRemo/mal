const { MalNil } = require("./types");

class Env {
  #outer;
  #binds;
  #exprs;
  data;

  constructor({ outer, binds, exprs }) {
    this.#outer = outer;
    this.#binds = binds;
    this.#exprs = exprs;
    this.data = {};
  }

  bind_exprs() {
    this.#binds.forEach((e, i) => {
      this.set(e.value, this.#exprs[i]);
    });
  }

  set(key, value) {
    this.data[key] = value;
  }

  find(key) {
    if (this.data[key]) return this;

    return this.#outer instanceof MalNil ? new MalNil() : this.#outer.find(key);
  }

  get(key) {
    if (this.find(key) instanceof MalNil) throw new Error(`${key} not found`);

    return this.find(key).data[key];
  }
}

module.exports = { Env };
