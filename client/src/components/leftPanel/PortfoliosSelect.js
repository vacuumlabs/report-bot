import React from 'react'
import { withRouter } from 'react-router-dom'

import { Select } from '../ui/Select'
import settingsIcon from '../../assets/settings.svg'
import './PortfoliosSelect.scss'

export function portfolioStringsToObjects(portfolioStrings) {
	return portfolioStrings ? portfolioStrings.map((p) => ({ label: p, value: p })) : []
}

function PortfoliosSelect({value, onChange, options, placeholder, showSettings, onSettingsClick}) {	
	return (<div className="multiSelectContainer">
		<div className={showSettings ? 'multiSelectShort' : 'multiSelect'}>
			<Select
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				options={options}
				isMulti
			/>
		</div>
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
