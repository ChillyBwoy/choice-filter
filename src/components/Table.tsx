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
      color: "#445569",
      mobile: "iOS",
      fruit: "Apple"
    });

    console.log(choices);
    console.log(data);

    return (
      <table>
        <thead>

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