import React from "react";

import { DataFilterFields } from "../filter";
import {
  Person,
  PersonMap
} from "../types";

export interface FilterTableItemProps {
  fields: DataFilterFields<Person>;
  data: PersonMap;
}

export class FilterTableItem extends React.Component<FilterTableItemProps, {}> {
  render() {
    const {
      data,
      fields,
    } = this.props;

    return (
      <tr>
        {Object.keys(fields).map((f: keyof Person) => {
          return fields[f]!.format
            ? (<td>{fields[f]!.format!(data[f], data)}</td>)
            : (<td>{data[f]}</td>)
        })}
      </tr>
    );
  }
}
