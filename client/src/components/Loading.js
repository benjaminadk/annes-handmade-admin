import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '10vh',
    marginBottom: '10vh'
  }
})

const Loading = ({ classes }) => (
  <div className={classes.root}>
    <CircularProgress
      variant="indeterminate"
      color="primary"
      size={100}
      thickness={3}
    />
    <Typography variant="body2" align="center">
      Loading...
    </Typography>
  </div>
)

export default withStyles(styles)(Loading)
