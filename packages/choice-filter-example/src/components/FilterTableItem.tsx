import * as React from "react";
import { PureComponent } from "react";
import { ChoiceFilterFields } from "choice-filter";

import {
  Person,
  PersonMap
} from "../types";

export interface FilterTableItemProps {
  fields: ChoiceFilterFields<Person>;
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
          return fields[f]!.serialize
            ? (<td key={i}>{fields[f]!.serialize!(data[f])}</td>)
            : (<td key={i}>{data[f]}</td>)
        })}
      </tr>
    );
  }
}

export default FilterTableItem;