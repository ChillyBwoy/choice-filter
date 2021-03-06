import * as React from "react";
import * as ReactDOM from "react-dom";

import choiceFilter, { ChoiceFilterFields } from "choice-filter";

import FilterTable from "./components/FilterTable";
import { Person } from "./types";

const people = require("./data/people.json");

const fields: ChoiceFilterFields<Person> = {
  isActive: {
    serialize(item) {
      return item ? "yes" : "no";
    },
    match(v, values) {
      return values.indexOf(
        this.serialize ? this.serialize(v) : v
      ) !== -1;
    }
  },
  age: {
    serialize(item) {
      return item.toString();
    },
    match(v, values) {
      return values.indexOf(v.toString()) !== -1;
    }
  },
  firstName: {
    ignore: true
  },
  lastName: {
    ignore: true
  },
  gender: {},
  state: {},
  city: {},
  registeredAt: {
    ignore: true
  },
  color: {},
  mobile: {},
  os: {},
  fruit: {},
  tags: {
    match(v, values) {
      return values.indexOf(
        this.serialize ? this.serialize(v) : v
      ) !== -1;
    },
    serialize(list: any[]) {
      return list.slice(0).sort().join("|");
    }
  }
};

const filter = choiceFilter<Person>(fields);

ReactDOM.render(
  <FilterTable
      fields={fields}
      filter={filter}
      input={people} />, document.getElementById('root')
);