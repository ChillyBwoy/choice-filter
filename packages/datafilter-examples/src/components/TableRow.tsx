import React, { PureComponent } from "react";
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
        {Object.keys(fields).map((f: keyof Person) => {
          return fields[f]!.format
            ? (<td>{fields[f]!.format!(data[f], data)}</td>)
            : (<td>{data[f]}</td>)
        })}
      </tr>
    );
  }
}

export default FilterTableItem;