const { MalNil } = require("./types");

class Env {
  #outer;
  #data;

  constructor(outer) {
    this.#outer = outer;
    this.#data = {};
  }

  set(key, value) {
    this.#data[key] = value;
    return value;
  }

  find(key) {
    if (this.#data[key]) return this.#data[key];

    return this.#outer instanceof MalNil ? new MalNil() : this.#outer.find(key);
  }

  get(key) {
    if (this.find(key) instanceof MalNil) throw new Error(`${key} not found`);

    return this.find(key);
  }
}

module.exports = { Env };
