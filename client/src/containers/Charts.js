import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { compose, graphql } from 'react-apollo'
import { GET_ALL_SALES_QUERY } from '../apollo/queries/getAllSales'
import Loading from '../components/Loading'
import SalesByDate from '../components/Charts.SalesByDate'

const styles = theme => ({})

class Charts extends Component {
  state = {
    salesByDate: []
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
    this.setState({ salesByDate })
  }

  render() {
    const {
      data: { loading },
      classes
    } = this.props
    if (loading) return <Loading />
    return (
      <div className={classes.root}>
        <SalesByDate data={this.state.salesByDate} />
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
  graphql(GET_ALL_SALES_QUERY)
)(Charts)
