import React from "react";
import ReactDOM from "react-dom";

import dataFilter from "@chillybwoy/datafilter";

import FilterTable from "./components/Table";
import { Person } from "./types";

fetch('/data/people.json')
  .then(r => r.json())
  .then(json => {
    const fields = {
      isActive: {
        format(value: boolean) {
          return value ? "yes" : "no"
        }
      },
      age: {},
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
        format(value: string[]) {
          return value.join(", ");
        },
        serialize(list: any[]) {
          return list.slice(0).sort().join("|");
        }
      }
    };

    const filter = dataFilter<Person>(fields);

    ReactDOM.render(
      <FilterTable
          fields={fields}
          filter={filter}
          input={json} />, document.getElementById('root')
    );
  });
