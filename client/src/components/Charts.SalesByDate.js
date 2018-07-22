import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
  Crosshair
} from 'react-vis'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})

class SalesByDate extends Component {
  state = {
    crosshairValues: []
  }

  handleMouseOver = (datapoint, event) =>
    this.setState({ crosshairValues: [datapoint] })

  handleMouseOut = () => this.setState({ crosshairValues: [] })

  formatCrosshairTitle = values => ({ title: 'Sale', value: '' })

  formatCrosshairItems = values => [
    { title: 'date', value: moment(values[0].x).format('MMM DD YYYY') },
    { title: 'total', value: `$${values[0].y}` }
  ]

  handleTickFormatX = v => {
    let str = v.toString().slice(4, 10)
    if (str[4] === '0') return str.replace('0', '')
    return str
  }

  handleTickFormatY = v => {
    return `$ ${v}`
  }

  render() {
    const { data, classes } = this.props
    if (!data.length) return null
    return (
      <div className={classes.root}>
        <Typography variant="display1">Sales By Date</Typography>
        <XYPlot
          height={400}
          width={600}
          margin={{ top: 50, right: 50, bottom: 100, left: 50 }}
          xDomain={[data[0].x, data[data.length - 1].x]}
          xType="time"
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis
            tickLabelAngle={-55}
            tickFormat={v => this.handleTickFormatX(v)}
            style={{ text: { fontFamily: 'Roboto' } }}
          />
          <YAxis
            tickFormat={v => this.handleTickFormatY(v)}
            style={{ text: { fontFamily: 'Roboto' } }}
          />
          <MarkSeries
            data={data}
            sizeRange={[5, 25]}
            stroke="#6a936f"
            strokeWidth={1.5}
            fill="#ae7bc4"
            opacity="0.8"
            onValueMouseOver={this.handleMouseOver}
            onValueMouseOut={this.handleMouseOut}
          />
          <Crosshair
            values={this.state.crosshairValues}
            itemsFormat={this.formatCrosshairItems}
            titleFormat={this.formatCrosshairTitle}
            style={{
              line: { display: 'none' },
              box: { fontFamily: 'Roboto', backgroundColor: '#6a936f' }
            }}
          />
        </XYPlot>
      </div>
    )
  }
}

export default withStyles(styles)(SalesByDate)
