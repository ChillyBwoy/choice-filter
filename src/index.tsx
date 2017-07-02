import React from "react";
import ReactDOM from "react-dom";

import { dataFilter } from "./filter.js";
import { FilterTable } from "./components/Table.js";
import { Person } from "./types";

// const f = filter.filter({
//   gender: "male",
//   fruit: "apple"
// });


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
      firstName: {},
      lastName: {},
      gender: {},
      state: {},
      city: {},
      registeredAt: {},
      color: {},
      mobile: {},
      os: {},
      fruit: {},
      tags: {
        format(value: string[]) {
          return value.join(", ");
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
