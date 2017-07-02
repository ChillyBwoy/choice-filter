import * as React from "react";
import { Component } from "react";
import {
  DataFilter,
  DataFilterFields,
} from "@chillybwoy/datafilter";

import { Person } from "../types";

import FilterTableItem from "./FilterTableItem";

export interface FilterTableProps {
  input: Person[];
  filter: DataFilter<Person>;
  fields: DataFilterFields<Person>;
}

export interface FilterTableState {
  values: {
    [key: string]: any;
  }
}

class FilterTable extends Component<FilterTableProps, FilterTableState> {
  constructor(props: FilterTableProps) {
    super(props);

    this.state = {
      values: {}
    };
  }

  _handleChoiceChange(event: React.ChangeEvent<HTMLInputElement>, key: string) {
    const { value } = event.target;
    const { values } = this.state;

    this.setState({
      values: {
        ...values,
        [key]: value === '' ? undefined : value
      }
    });
  }

  renderTh(fields: any, name: string, choices: string[]) {
    const field = fields[name];
    const { values } = this.state;

    return (
      <div>
        <div>{name}</div>
        {field.ignore ? null : (
          <div>
            <label>
              <input type="radio"
                    name={name}
                    checked={values[name] === undefined}
                    value=""
                    onChange={e => this._handleChoiceChange(e, name)} />
              <span>---</span>
            </label>
            {choices ? choices.map((c, i) => (
              <label key={i}>
                <input type="radio"
                      name={name}
                      value={c}
                      checked={values[name] === c}
                      onChange={e => this._handleChoiceChange(e, name)} />
                <span>{c}</span>
              </label>
            )) : null}
          </div>
        )}
      </div>
    )
  }

  render() {
    const { values } = this.state;
    const {
      input,
      filter,
      fields,
    } = this.props;

    const {
      choices,
      data,
    } = filter(input, values);

    return (
      <table>
        <thead>
          <tr>
            {Object.keys(fields).map((f, i) => (
              <th key={i}>
                {this.renderTh(fields, f, choices[f])}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <FilterTableItem key={d.id} data={d} fields={fields} />
          ))}
        </tbody>
      </table>
    )
  }
}

export default FilterTable;