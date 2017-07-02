import * as React from "react";
import * as ReactDOM from "react-dom";

import dataFilter, { DataFilterFields } from "@chillybwoy/datafilter";

import FilterTable from "./components/FilterTable";
import { Person } from "./types";

fetch('/data/people.json')
  .then(r => r.json())
  .then(json => {
    const fields: DataFilterFields<Person> = {
      isActive: {
        format(value: boolean) {
          return value ? "yes" : "no"
        }
      },
      age: {
        ignore: true
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
        match(item, value) {
          const s = this.serialize ? this.serialize(item) : "";
          return s === value;
        },
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
