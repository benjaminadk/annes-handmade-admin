import React from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  image: {
    width: '75%',
    marginTop: '5vh',
    marginLeft: '5vw'
  }
})

const Home = ({ classes }) => (
  <div>
    <img
      src="https://s3-us-west-1.amazonaws.com/shopping-site/assets/admin-home-800x500.png"
      alt="annes admin"
      className={classes.image}
    />
  </div>
)

export default withStyles(styles)(Home)
