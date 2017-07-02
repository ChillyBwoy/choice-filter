import React, { Component } from "react";
import {
  DataFilter,
  DataFilterFields,
} from "@chillybwoy/datafilter";

import { Person } from "../types";

import FilterTableItem from "./TableRow";

export interface FilterTableProps {
  input: Person[];
  filter: DataFilter<Person>;
  fields: DataFilterFields<Person>;
}

export interface FilterTableState {}

class FilterTable extends Component<FilterTableProps, FilterTableState> {
  renderTh(fields: any, key: string, choices?: string[]) {
    const field = fields[key];
    return (
      <th>
        <div>{key}</div>
        <div>
          {choices ? choices.map(c => (
            <label>
              <input type="checkbox" value={c} />
              <span>{c}</span>
            </label>
          )) : null}
        </div>
      </th>
    )
  }

  render() {
    const {
      input,
      filter,
      fields,
    } = this.props;

    const {
      choices,
      data,
    } = filter(input, {
      gender: "female",
      color: "#54D1F1",
      mobile: "iOS",
      fruit: "Apple",
      os: "OS X",
      city: "London"
    });

    console.log(data.length, choices);

    return (
      <table>
        <thead>
          {Object.keys(fields).map(f => {
            return this.renderTh(fields, f, choices[f]);
          })}
        </thead>
        <tbody>
          {data.map(d => (
            <FilterTableItem data={d} fields={fields} />
          ))}
        </tbody>
      </table>
    )
  }
}

export default FilterTable;