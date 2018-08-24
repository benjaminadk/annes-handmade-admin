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
import Button from '@material-ui/core/Button'
import moment from 'moment'

const buttons = ['Q1', 'Q2', 'Q3', 'Q4', 'Full Year', '1st Half', '2nd Half']

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    marginRight: '1vw'
  }
})

class SalesByDate extends Component {
  formatCrosshairTitle = values => ({ title: 'Sale', value: '' })

  formatCrosshairItems = values => [
    { title: 'date', value: moment(values[0].x).format('MMM DD YYYY') },
    { title: 'total', value: `$${values[0].y.toFixed(2)}` }
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
    const {
      handleDomainChange,
      handleMouseOver,
      handleMouseOut,
      data,
      q0,
      domain1,
      domain2,
      subTitle,
      crosshairValues,
      buttonIndex,
      classes
    } = this.props
    if (!data.length) return null
    return (
      <div className={classes.root}>
        <Typography variant="display1">Sales By Date - {subTitle}</Typography>
        <XYPlot
          height={400}
          width={800}
          margin={{ top: 50, right: 100, bottom: 100, left: 100 }}
          xDomain={[moment(q0).quarter(domain1), moment(q0).quarter(domain2)]}
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
            sizeRange={[3, 20]}
            stroke="#6a936f"
            strokeWidth={1.5}
            fill="#ae7bc4"
            opacity="0.8"
            onValueMouseOver={handleMouseOver}
            onValueMouseOut={handleMouseOut}
          />

          <Crosshair
            values={crosshairValues}
            itemsFormat={this.formatCrosshairItems}
            titleFormat={this.formatCrosshairTitle}
            style={{
              line: { display: 'none' },
              box: { fontFamily: 'Roboto', backgroundColor: '#6a936f' }
            }}
          />
        </XYPlot>
        <div className={classes.buttonContainer}>
          {buttons.map((b, i) => (
            <Button
              key={b}
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleDomainChange(i)}
              className={classes.button}
              style={{
                border: buttonIndex === i ? '2px solid #ae7bc4' : 'none'
              }}
            >
              {b}
            </Button>
          ))}
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(SalesByDate)
