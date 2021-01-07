import React from 'react'
import ReactSelect from 'react-select'

const customStyles = {
	control: (provided) => ({
		...provided,
    minHeight: '40px',
		borderRadius: '4px',
		border: '1px solid #7991a6',
		color: '#757575',
		fontFamily: '"Lato", sans-serif',
		fontSize: '16px',
	}),
	placeholder: (provided) => ({
		...provided,
		lineHeight: '36px',
	}),
	valueContainer: (provided) => ({
		...provided,
		minHeight: '36px !important',
		padding: '0px 8px',
	}),
	multiValue: (provided) => ({
		...provided,
		borderRadius: '4px',
		padding: '2px',
		marginTop: '6px'
	}),
	multiValueRemove: (provided) => ({
		...provided,
    ':hover': {
      backgroundColor: '#eb4a5b',
      color: 'white',
    },
  }),
	value: (provided) => ({
		...provided,
		lineHeight: '36px !important'
	}),
	valueLabel: (provided) => ({
		...provided,
		lineHeight: '36px'
	}),
	input: (provided) => ({
		...provided,
		minHeight: '36px',
		padding: '8px 0px',
		fontFamily: '"Lato", sans-serif'
	}),
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isSelected ? '#4b5967' : (state.isFocused ? '#7991a6' : '#ffffff'),
		color: state.isSelected || state.isFocused ? '#ffffff' : '#757575',
		cursor: 'pointer'
	}),
}

export const Select = ({value, onChange, placeholder, options=[], isMulti=false, isClearable=false}) => {
	return <ReactSelect
		styles={customStyles}
		value={value}
		onChange={onChange}
		placeholder={placeholder}
		options={options}
		isMulti={isMulti}
		closeMenuOnSelect={!isMulti}
		isClearable={isClearable}
	/>
}
