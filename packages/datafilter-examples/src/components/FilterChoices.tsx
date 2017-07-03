import * as React from "react";
import { Component } from "react";

export interface FilterChoicesProps {
  choices: any[];
  name: string;
  onChange: (name: string, values: any[]) => void;
}

export interface FilterChoicesState {
  values: any[];
}

class FilterChoices extends Component<FilterChoicesProps, FilterChoicesState> {
  static defaultProps = {
    choices: [],
    onChange: (name: string, values: any[]) => {}
  }

  constructor(props: FilterChoicesProps) {
    super(props);
    this.state = {
      values: []
    }
  }

  _handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      checked,
      value,
    } = event.target;
    const {
      name,
      onChange
    } = this.props;
    const { values } = this.state;

    this.setState({
      values: checked ? values.concat(value) : values.filter(v => v !== value)
    }, () => {
      const { values } = this.state;
      onChange(name, values);
    });
  }

  render() {
    const { values } = this.state;
    const {
      choices,
      name,
    } = this.props;

    return (
      <div className="filterChoices">
        {choices.slice(0).sort().map((c, i) => (
          <label key={i}>
            <input type="checkbox"
                  name={name}
                  value={c}
                  checked={values.indexOf(c) !== -1}
                  onChange={this._handleChange} />
            <span>{c}</span>
          </label>
        ))}
      </div>
    );
  }
}

export default FilterChoices;