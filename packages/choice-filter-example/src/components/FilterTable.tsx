import * as React from "react";
import { Component } from "react";
import {
  ChoiceFilter,
  ChoiceFilterFields,
  ChoiceFilterMap,
} from "choice-filter";

import { Person } from "../types";

import FilterTableItem from "./FilterTableItem";
import FilterChoices from "./FilterChoices";

export interface FilterTableProps {
  input: Person[];
  filter: ChoiceFilter<Person>;
  fields: ChoiceFilterFields<Person>;
}

export interface FilterTableState {
  values: {
    [key: string]: any;
  }
}

class FilterTable extends Component<FilterTableProps, FilterTableState> {
  constructor(props: FilterTableProps) {
    super(props);

    const { fields } = props;
    const values: ChoiceFilterMap<any[]> = {};

    this.state = {
      values: {}
    };
  }

  _handleChoicesChange = (name: string, value: any) => {
    const { values } = this.state;

    this.setState({
      values: {
        ...values,
        [name]: value
      }
    });
  }

  renderTh(fields: any, name: string, choices: string[]) {
    const field = fields[name];

    return (
      <div>
        <p>{name}</p>
        {field.ignore ? null : (
          <div>
            {choices ? (
              <FilterChoices name={name}
                             choices={choices}
                             onChange={this._handleChoicesChange} />
            ) : null}
          </div>
        )}
      </div>
    )
  }

  render() {
    const {
      input,
      filter,
      fields,
    } = this.props;
    const { values } = this.state;

    const {
      choices,
      data,
    } = filter(input, values);

    return (
      <div>
        <h3>{data.length} / {input.length}</h3>
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
        <h3>Query:</h3>
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </div>
    )
  }
}

export default FilterTable;