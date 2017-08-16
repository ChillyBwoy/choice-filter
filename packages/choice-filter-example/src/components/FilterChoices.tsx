import * as React from "react";
import { Component } from "react";

export interface FilterChoicesProps {
  choices: string[];
  choicesAll: string[];
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
    const { value } = event.target;
    const { values } = this.state;
    const {
      name,
      onChange,
    } = this.props;

    this.setState({
      values: values.indexOf(value) === -1
        ? values.concat(value)
        : values.filter((x: any) => x !== value)
    }, () => {
      const { values } = this.state;
      onChange(name, values);
    });
  }

  render() {
    const { values } = this.state;
    const {
      choices,
      choicesAll,
      name,
    } = this.props;

    return (
      <div className="filterChoices">
        {choicesAll.sort().map((c, i) => (
          <label key={i}>
            <input type="checkbox"
                   name={name}
                   value={c}
                   disabled={choices.indexOf(c) === -1}
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