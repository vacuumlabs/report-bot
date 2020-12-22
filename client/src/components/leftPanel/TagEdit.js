import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import Switch from 'react-switch';

import './TagEdit.scss'
import { updateTag } from '../../utils/serverApi'
import Modal from './Modal';
import PortfoliosSelect, {portfolioStringsToObjects} from './PortfoliosSelect';

class TagEdit extends Component {
  state = {
    asanaLink: this.props.tag.asanaLink || '',
    portfolios: this.props.tag.portfolios?.map(
      (p) => ({ label: p, value: p })
    ) || [],
    isArchived: this.props.tag.isArchived || false,
    loading: false,
    resultType: '',
  }

  onClose = () => {
    if (this.props.history.length > 2) {
      this.props.history.goBack()
    } else {
      // in case tag edit was first visited site
      this.props.history.push(`/${encodeURI(this.props.tag.tag)}`)
    }
	}

  onSubmit = async () => {
    const { tag, loadReports } = this.props
    const { isArchived, asanaLink, portfolios } = this.state
    const data = {
      tag: tag.tag,
      isArchived,
      asanaLink,
      portfolios: portfolios.map((p) => p.value),
    }

    this.setState({ loading: true })
    const result = await updateTag(data)
    await loadReports() // refresh tag list after update
    this.setState({ loading: false })
    this.setState({ resultType: result?.name === 'error' ? 'error' : 'success' })
  }

  isFormChanged = () => {
    const {isArchived: iA_S, asanaLink: aL_S, portfolios: p_S} = this.state
    const {isArchived: iA_T, asanaLink: aL_T, portfolios: p_T} = this.props.tag
    const form = {isArchived: iA_S, asanaLink: aL_S, portfolios: p_S}
    const tag = {isArchived: iA_T || false, asanaLink: aL_T || '', portfolios: portfolioStringsToObjects(p_T)}
    return _.isEqual(form, tag)
  }

  render() {
    const { tag, portfolioOptions } = this.props
    const { isArchived, asanaLink, portfolios, loading, resultType } = this.state
    return (<Modal
        title={`Edit ${tag.tag}`}
        onClose={this.onClose}
        onSubmit={this.onSubmit}
        loading={loading}
        resultType={resultType}
        resultMessage={
          resultType === 'error' ?
            'Tag could not be updated.' : resultType === 'success' ?
              'Tag updated successfully.' : ''}
        disabledButton={this.isFormChanged()}
      >
      <div className="formGroup">
        <div className="label">
          Portfolios
        </div>
        <PortfoliosSelect
          options={portfolioOptions}
          value={portfolios}
          onChange={(portfolios) => this.setState({portfolios})}
          placeholder="Choose portfolios..."
          showSettings
        />
      </div>
      <div className="formGroup">
        <div className="label">
          Link to Asana
        </div>
        <input
          type="text"
          value={asanaLink}
          onChange={(e) => this.setState({asanaLink: e.target.value})}
          placeholder="Enter link..."
        />
      </div>
      <div className="formGroup">
        <div className="label">
          Is archived
        </div>
        <Switch
          checked={isArchived}
          onChange={(checked) => this.setState({isArchived: checked})}
          onColor="#188de0"
          checkedIcon={false}
          uncheckedIcon={false}
        />
      </div>
    </Modal>)
  }
}

export default withRouter(TagEdit)
