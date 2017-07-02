import * as React from "react";
import { PureComponent } from "react";
import { DataFilterFields } from "@chillybwoy/datafilter";

import {
  Person,
  PersonMap
} from "../types";

export interface FilterTableItemProps {
  fields: DataFilterFields<Person>;
  data: PersonMap;
}

class FilterTableItem extends PureComponent<FilterTableItemProps, {}> {
  render() {
    const {
      data,
      fields,
    } = this.props;

    return (
      <tr>
        {Object.keys(fields).map((f: keyof Person, i) => {
          return fields[f]!.format
            ? (<td key={i}>{fields[f]!.format!(data[f], data)}</td>)
            : (<td key={i}>{data[f]}</td>)
        })}
      </tr>
    );
  }
}

export default FilterTableItem;