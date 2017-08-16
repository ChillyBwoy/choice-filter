import * as React from "react";
import * as ReactDOM from "react-dom";

import choiceFilter, { ChoiceFilterFields } from "choice-filter";

import FilterTable from "./components/FilterTable";
import { Person } from "./types";

const people = require("./data/people.json");

const fields: ChoiceFilterFields<Person> = {
  isActive: {
    ignore: true,
    // match(v, values) {
    //   return values.indexOf(
    //     this.serialize ? this.serialize(v) : v
    //   ) !== -1;
    // }
    serialize(item) {
      return item ? "yes" : "no";
    },
  },
  age: {
    ignore: true,
    // match(v, values) {
    //   return values.indexOf(v.toString()) !== -1;
    // }
    serialize(item) {
      return item.toString();
    },
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
    ignore: true,
    // match(v, values) {
    //   return values.indexOf(
    //     this.serialize ? this.serialize(v) : v
    //   ) !== -1;
    // },
    serialize(list: any[]) {
      return list.slice(0).sort().join("|");
    }
  }
};

const filter = choiceFilter<Person>(fields);

ReactDOM.render(
  <FilterTable
      choices={filter(people, {}).choices}
      fields={fields}
      filter={filter}
      input={people} />, document.getElementById('root')
);