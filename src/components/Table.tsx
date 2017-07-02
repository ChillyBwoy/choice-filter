import React from "react";

import { Person } from "../types";
import {
  dataFilter,
  DataFilter,
  DataFilterFields,
} from "../filter";
import { FilterTableItem } from "./TableRow.js";

export interface FilterTableProps {
  input: Person[];
  filter: DataFilter<Person>;
  fields: DataFilterFields<Person>;
}

export interface FilterTableState {}

export class FilterTable extends React.Component<FilterTableProps, FilterTableState> {
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
      // color: "#54D1F1",
      // mobile: "iOS",
      // fruit: "Apple",
      // os: "OS X"
    });

    return (
      <table>
        <thead>
          {Object.keys(fields).map(f => {
            const field = fields[f];
            if (field && field.name) {
              return (
                <th>{field.name}</th>
              )
            }
            return (
              <th>{f}</th>
            )
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