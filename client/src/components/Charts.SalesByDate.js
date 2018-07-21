import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries
} from 'react-vis'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})

class SalesByDate extends Component {
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
          />
        </XYPlot>
      </div>
    )
  }
}

export default withStyles(styles)(SalesByDate)
