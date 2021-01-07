import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { createPortfolio, deletePortfolio } from '../../utils/serverApi'
import deleteIcon from '../../assets/delete.svg'
import './EditPortfolios.scss'
import './TagEdit.scss'
import Modal from './Modal'
import Loader from '../ui/Loader'

class EditPortfolios extends Component {
  state = {
    addInput: '',
    deleteSearchInput: '',
    loading: false,
    resultType: ''
  }

  onAddInputChange = (e) => {
    this.setState({resultType: ''}) // reset success/error
    this.setState({addInput: e.target.value})
  }

  onCreate = async (e, name) => {
    e.preventDefault() // prevent reloading page with button click
    this.setState({resultType: ''}) // reset success/error
    const data = { name }

    this.setState({ loading: true })
    const result = await createPortfolio(data)
    await this.props.loadPortfolioOptions() // refresh portfolio options after add
    this.setState({ loading: false })
    this.setState({ resultType: result?.name === 'error' ? 'error' : 'success' })
  }

  onDelete = async (name) => {
    this.setState({resultType: ''}) // reset success/error
    await deletePortfolio(name)
    await this.props.loadPortfolioOptions() // refresh portfolio options after delete
    await this.props.loadReports() // refresh tag list after delete (portfolio assignment might change)
  }

  render() {
    const {portfolioOptions, onClose} = this.props
    const {addInput, deleteSearchInput, resultType, loading} = this.state
    const disabledButton = addInput.length < 2 || portfolioOptions.map((p) => p.label).includes(addInput)
    return (<Modal
      title="Edit portfolios"
      onClose={onClose}
      onSubmit={this.onSubmit}
    >
      <div className="formGroup">
        <div className="label">
          Add new portfolio
        </div>
        <div className="addContainer">
          <input
            type="text"
            className="input addInput"
            value={addInput}
            onChange={this.onAddInputChange}
            placeholder="Enter name..."
          />
          {loading ? (
            <div className="loading">
              <Loader light size={36} />
            </div>
          ) : (
            <button
              className={`addButton ${disabledButton ? 'disabled' : ''}`}
              onClick={(e) => this.onCreate(e, addInput)}
              disabled={disabledButton}
            >Add</button>
          )}
        </div>
        <div className="resultMessage">
          <div className={resultType}>
            {resultType === 'error' ?
              `Could not add portfolio ${addInput}.` : resultType === 'success' ? 
                `Successfully added portfolio ${addInput}.` : ''}
          </div>
        </div>
      </div>

      <div className="deleteWarning">Deleting a portfolio also deletes all of its occurrences!</div>

      <div className="formGroup">
        <input
          type="text"
          className="input deleteSearchInput"
          value={deleteSearchInput}
          onChange={(e) => this.setState({deleteSearchInput: e.target.value})}
          placeholder="Search portfolio..."
        />
      </div>
      <div className="deleteList">
        {portfolioOptions
          .filter((p) => p.label.toLowerCase().includes(deleteSearchInput.toLowerCase()))
          .sort((a, b) => b.label - a.label)
          .map((p) => (
            <div className="item" key={p.value}>
              <div>
                {p.value}
              </div>
              <img 
                src={deleteIcon}
                className="delete"
                alt="delete"
                onClick={() => this.onDelete(p.value)}
              />
            </div>
        ))}
      </div>
    </Modal>)
  }
}

export default withRouter(EditPortfolios)