import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { compose, graphql } from 'react-apollo'
import { GET_ALL_SALES_QUERY } from '../apollo/queries/getAllSales'
import Loading from '../components/Loading'
import SalesByDate from '../components/Charts.SalesByDate'
import moment from 'moment'

const styles = theme => ({})

class Charts extends Component {
  state = {
    salesByDate: [],
    domain1: 1,
    domain2: 5,
    subTitle: '',
    crosshairValues: []
  }

  componentDidMount() {
    if (!this.props.data.loading) {
      const { getAllSales } = this.props.data
      this.handleSalesByDate(getAllSales)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data.loading && !this.props.data.loading) {
      const { getAllSales } = this.props.data
      this.handleSalesByDate(getAllSales)
    }
  }

  handleSalesByDate = sales => {
    let salesByDate = sales.map(s => {
      return {
        x: new Date(s.createdOn).getTime(),
        y: s.total,
        size: Math.ceil(s.total)
      }
    })
    let year = moment().year()
    let q0 = moment(`${year}-01-01T00:00:00.000`)

    let month = moment().month()
    this.handleDomainChange(month < 3 ? 0 : month < 6 ? 1 : month < 9 ? 2 : 3)

    this.setState({ salesByDate, q0 })
  }

  handleDomainChange = index => {
    let year = moment().year()
    switch (index) {
      case 0:
        return this.setState({
          domain1: 1,
          domain2: 2,
          subTitle: `Q1 ${year}`,
          crosshairValues: []
        })
      case 1:
        return this.setState({
          domain1: 2,
          domain2: 3,
          subTitle: `Q2 ${year}`,
          crosshairValues: []
        })
      case 2:
        return this.setState({
          domain1: 3,
          domain2: 4,
          subTitle: `Q3 ${year}`,
          crosshairValues: []
        })
      case 3:
        return this.setState({
          domain1: 4,
          domain2: 5,
          subTitle: `Q4 ${year}`,
          crosshairValues: []
        })
      case 4:
        return this.setState({
          domain1: 1,
          domain2: 5,
          subTitle: `All ${year}`,
          crosshairValues: []
        })
      case 5:
        return this.setState({
          domain1: 1,
          domain2: 3,
          subTitle: `1st Half ${year}`,
          crosshairValues: []
        })
      case 6:
        return this.setState({
          domain1: 3,
          domain2: 5,
          subTitle: `2nd Half ${year}`,
          crosshairValues: []
        })
      default:
        return
    }
  }

  handleMouseOver = (datapoint, event) =>
    this.setState({ crosshairValues: [datapoint] })

  handleMouseOut = (datapoint, event) => this.setState({ crosshairValues: [] })

  render() {
    const {
      data: { loading },
      classes
    } = this.props
    if (loading) return <Loading />
    return (
      <div className={classes.root}>
        <SalesByDate
          handleDomainChange={this.handleDomainChange}
          handleMouseOver={this.handleMouseOver}
          handleMouseOut={this.handleMouseOut}
          data={this.state.salesByDate}
          q0={this.state.q0}
          domain1={this.state.domain1}
          domain2={this.state.domain2}
          subTitle={this.state.subTitle}
          crosshairValues={this.state.crosshairValues}
        />
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
  graphql(GET_ALL_SALES_QUERY)
)(Charts)
