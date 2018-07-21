import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { Switch, Route } from 'react-router-dom'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import LoginDialog from './components/Root.LoginDialog'
import Upload from './containers/Upload'
import Sales from './containers/Sales'
import Inventory from './containers/Inventory'
import Users from './containers/Users'
import Charts from './containers/Charts'
import RootMenu from './components/Root.Menu'
import './styles/tables.css'
import './styles/charts.css'

import 'typeface-roboto'

const drawerWidth = 240

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    height: '100%'
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0
  },
  toolbar: theme.mixins.toolbar
})

class Root extends Component {
  state = {
    open: false,
    username: '',
    password: '',
    error: false,
    message: ''
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  attemptLogin = async () => {
    const { username, password } = this.state
    const response = await this.props.login({
      variables: { username, password }
    })
    if (!response.data.login.success) {
      await this.setState({ error: true, message: response.data.login.message })
      return
    } else {
      await this.setState({ open: false })
      return
    }
  }

  render() {
    const { classes } = this.props
    return [
      <div key="root-main" className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap>
              Anne's Handmade Admin
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <RootMenu />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path="/" render={() => <h1>Home</h1>} />
            <Route path="/upload" component={Upload} />
            <Route path="/sales" component={Sales} />
            <Route path="/inventory" component={Inventory} />
            <Route path="/users" component={Users} />
            <Route path="/charts" component={Charts} />
          </Switch>
        </main>
      </div>,
      <LoginDialog
        key="root-dialog"
        attemptLogin={this.attemptLogin}
        handleChange={this.handleChange}
        open={this.state.open}
        username={this.state.username}
        password={this.state.password}
        error={this.state.error}
        message={this.state.message}
      />
    ]
  }
}

const ADMIN_LOGIN = gql`
  mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      message
      admin {
        id
        username
      }
    }
  }
`

export default compose(
  withStyles(styles),
  graphql(ADMIN_LOGIN, { name: 'login' })
)(Root)
