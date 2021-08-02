import { Input } from "antd";
import React from "react";
import PlacesAutocomplete, { Suggestion } from "react-places-autocomplete";


class LocationSearchInput extends React.Component {
  state = {
    address: this.props.address
  };

  handleAddressChange = (address) => {
    this.setState({ address });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.props.address) {
      this.setState({ address: nextProps.address });
    }
  }

  render() {
    const { address } = this.state;

    return (
      <PlacesAutocomplete key={0} onChange={this.handleAddressChange} onSelect={this.props.onAddressSelect} value={address}>
        {({ getInputProps, getSuggestionItemProps, suggestions, loading }) => (
          <React.Fragment>
            <Input
            className="form-control"
              {...getInputProps({
                id: "address-input"
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading ? <div>Loading...</div> : null}
              {suggestions.map((suggestion) => {
                const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer", padding: 5 }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };

                const spread = {
                  ...getSuggestionItemProps(suggestion, {
                    className,
                    style
                  })
                };

                return (
                  <div {...spread} key={suggestion.id}>
                    <div>{suggestion.description}</div>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default LocationSearchInput;
