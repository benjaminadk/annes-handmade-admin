import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { graphql, compose } from 'react-apollo'
import { ADMIN_LOGIN } from './apollo/mutations/adminLogin'
import { Switch, Route } from 'react-router-dom'
import { PrivateRoute, Admin } from './utils/routing'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import LoginDialog from './components/Root.LoginDialog'
import Home from './containers/Home'
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
  toolbar: theme.mixins.toolbar,
  top: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  right: {
    marginRight: '1.5vw'
  }
})

class Root extends Component {
  state = {
    open: true,
    username: '',
    password: '',
    error: false,
    message: '',
    checked: false
  }

  componentWillMount() {
    let username = localStorage.getItem('USERNAME') || ''
    let password = localStorage.getItem('PASSWORD') || ''
    this.setState({
      username,
      password,
      checked: Boolean(username && password)
    })
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  attemptLogin = async () => {
    const { username, password, checked } = this.state
    const response = await this.props.login({
      variables: { username, password }
    })
    const { success, message } = response.data.login
    if (!success) {
      await this.setState({ error: true, message })
    } else {
      if (checked) {
        localStorage.setItem('USERNAME', username)
        localStorage.setItem('PASSWORD', password)
      }
      Admin.enterAdminMode()
      await this.setState({ open: false })
    }
  }

  handleCheckbox = (e, checked) => this.setState({ checked })

  render() {
    const { classes } = this.props
    return [
      <div key="root-main" className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar className={classes.top}>
            <Typography variant="title" color="inherit" noWrap>
              Anne's Admin
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
          <div className={classes.toolbar} />
          <RootMenu />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute path="/upload" component={Upload} />
            <PrivateRoute path="/sales" component={Sales} />
            <PrivateRoute path="/inventory" component={Inventory} />
            <PrivateRoute path="/users" component={Users} />
            <PrivateRoute path="/charts" component={Charts} />
          </Switch>
        </main>
      </div>,
      <LoginDialog
        key="root-dialog"
        attemptLogin={this.attemptLogin}
        handleChange={this.handleChange}
        handleCheckbox={this.handleCheckbox}
        open={this.state.open}
        username={this.state.username}
        password={this.state.password}
        error={this.state.error}
        message={this.state.message}
        checked={this.state.checked}
      />
    ]
  }
}

export default compose(
  withStyles(styles),
  graphql(ADMIN_LOGIN, { name: 'login' })
)(Root)
