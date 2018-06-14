import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { Switch, Route, Link } from 'react-router-dom'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import UploadIcon from '@material-ui/icons/FileUpload'
import HomeIcon from '@material-ui/icons/Home'
import MoneyIcon from '@material-ui/icons/MonetizationOn'
import InventoryIcon from '@material-ui/icons/Pageview'
import UsersIcon from '@material-ui/icons/Group'
import LoginDialog from './components/Root.LoginDialog'
import Upload from './containers/Upload'
import Sales from './containers/Sales'
import Inventory from './containers/Inventory'
import Users from './containers/Users'
import 'typeface-roboto'

const drawerWidth = 240

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, 
  },
  toolbar: theme.mixins.toolbar,
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
    if(!response.data.login.success) {
      await this.setState({ error: true, message: response.data.login.message })
      return
    } else {
      await this.setState({ open: false })
      return
    }
  }
  
  render() {
    const { classes } = this.props
    return ([
      <div key='root-main' className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap>Store Admin</Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          <List component='nav'>
            <ListItem button component={Link} to='/'>
              <ListItemIcon><HomeIcon/></ListItemIcon>
              <ListItemText primary='Home Page'/>
            </ListItem>
            <ListItem button component={Link} to='/upload'>
              <ListItemIcon><UploadIcon/></ListItemIcon>
              <ListItemText primary='Upload Product'/>
            </ListItem>
            <ListItem button component={Link} to='/sales'>
              <ListItemIcon><MoneyIcon/></ListItemIcon>
              <ListItemText primary='Sales'/>
            </ListItem>
            <ListItem button component={Link} to='/inventory'>
              <ListItemIcon><InventoryIcon/></ListItemIcon>
              <ListItemText primary='Inventory'/>
            </ListItem>
              <ListItem button component={Link} to='/users'>
              <ListItemIcon><UsersIcon/></ListItemIcon>
              <ListItemText primary='Users'/>
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path='/' render={() => (<h1>Home</h1>)}/>
            <Route path='/upload' component={Upload}/>
            <Route path='/sales' component={Sales}/>
            <Route path='/inventory' component={Inventory}/>
            <Route path='/users' component={Users}/>
          </Switch>
        </main>
      </div>,
      <LoginDialog 
        key='root-dialog'
        attemptLogin={this.attemptLogin}
        handleChange={this.handleChange}
        open={this.state.open}
        username={this.state.username}
        password={this.state.password}
        error={this.state.error}
        message={this.state.message}
      />
    ])
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
