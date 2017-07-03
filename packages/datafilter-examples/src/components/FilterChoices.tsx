import * as React from "react";
import { Component } from "react";

export interface FilterChoicesProps {
  choices: any[];
  name: string;
  onChange: (name: string, values: any[]) => void;
}

export interface FilterChoicesState {
  value: any;
}

class FilterChoices extends Component<FilterChoicesProps, FilterChoicesState> {
  static defaultProps = {
    choices: [],
    onChange: (name: string, values: any[]) => {}
  }

  constructor(props: FilterChoicesProps) {
    super(props);
    this.state = {
      value: undefined
    }
  }

  _handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const {
      name,
      onChange
    } = this.props;

    this.setState({
      value: value === '' ? undefined : value
    }, () => {
      const { value } = this.state;
      onChange(name, value);
    });
  }

  render() {
    const { value } = this.state;
    const {
      choices,
      name,
    } = this.props;

    return (
      <div className="filterChoices">
        <label>
          <input type="radio"
                name={name}
                value=""
                checked={value === undefined}
                onChange={this._handleChange} />
          <span>---</span>
        </label>
        {choices.slice(0).sort().map((c, i) => (
          <label key={i}>
            <input type="radio"
                  name={name}
                  value={c}
                  checked={value === c}
                  onChange={this._handleChange} />
            <span>{c}</span>
          </label>
        ))}
      </div>
    );
  }
}

export default FilterChoices;