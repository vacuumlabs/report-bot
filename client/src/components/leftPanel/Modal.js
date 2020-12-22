import React, { Component, PureComponent } from 'react'
import { withRouter } from 'react-router-dom'

import './Modal.scss'
import Loader from '../ui/Loader'

class Modal extends Component {
	render() {
		const {
			title,
			onClose,
			onSubmit,
			loading = false,
			resultType,
			resultMessage,
			disabledButton = false,
			children
		} = this.props
		return (<div className="Modal">
			<ClickHandler onClose={onClose}>
			  <div className="modal">
					<div className="topContainer">
						<div className="title">{title}</div>
						<div className="closeContainer">
							<div className="close" onClick={onClose} />
						</div>
					</div>
					<div className="modalContentContainer">
						<form className="modalContent">
							{children}
						</form>
					</div>
					{onSubmit && <div className="saveContainer">
						{loading ? (
							<div className="loading">
								<Loader light size={36} />
							</div>
							) : (
								<>
									{resultType && resultMessage && (
										<div className="resultMessage">
											<div className={resultType}>
												{resultMessage}
											</div>
										</div>
									)}
									<button
										className={`save ${disabledButton ? 'disabled' : ''}`}
										onClick={onSubmit}
										disabled={disabledButton}
									>
										Save changes
									</button>
								</>
							)
						}
					</div>}
				</div>
			</ClickHandler>
		</div>)
	}
}

const ESCAPE_KEY = 27

class ClickHandler extends PureComponent {
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside)
    document.addEventListener("keydown", this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside)
    document.removeEventListener("keydown", this.handleKeyDown)
  }

  handleClickOutside = ({ target }) => {
    if (this.wrapperRef && !this.wrapperRef.contains(target)) {
      this.props.onClose()
    }
  }

  handleKeyDown = (event) => {
    switch (event.keyCode) {
      case ESCAPE_KEY:
        this.props.onClose()
        break
      default:
        break
    }
  }

  render = () => (
    <div ref={(node) => (this.wrapperRef = node)}>{this.props.children}</div>
  )
}

export default withRouter(Modal)
