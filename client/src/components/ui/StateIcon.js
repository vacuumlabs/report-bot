import React from 'react'

import {tagStateNames} from '../constants'
import './StateIcon.scss'

export const StateIcon = ({state, showTooltip=false}) => {
	return showTooltip ? (<span data-tip={tagStateNames[state]}>
		<div className={`state ${state}`}></div>
	</span>) : (
		<div className={`state ${state}`}></div>
	)
}
