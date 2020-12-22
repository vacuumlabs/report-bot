import React from 'react'
import { withRouter } from 'react-router-dom'
import MultiSelect from 'react-multi-select-component'

import './PortfoliosSelect.scss'
import settingsIcon from '../../assets/settings.svg'

export function portfolioStringsToObjects(portfolioStrings) {
	return portfolioStrings ? portfolioStrings.map((p) => ({ label: p, value: p })) : []
}

function PortfoliosSelect({value, onChange, options, placeholder, showSettings, onSettingsClick}) {	
	return (<div className="multiSelectContainer">
		<MultiSelect
			className={showSettings ? 'multiSelectShort' : 'multiSelect'}
			options={options}
			value={value}
			onChange={onChange}
			overrideStrings={{ "selectSomeItems": placeholder }}
		/>
		{showSettings && onSettingsClick && (
			<img 
				src={settingsIcon}
				className="settings"
				alt="settings"
				onClick={onSettingsClick} 
			/>
		)}
	</div>)
}


export default withRouter(PortfoliosSelect)
