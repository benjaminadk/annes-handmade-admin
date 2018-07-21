import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import UploadIcon from '@material-ui/icons/FileUpload'
import HomeIcon from '@material-ui/icons/Home'
import MoneyIcon from '@material-ui/icons/MonetizationOn'
import InventoryIcon from '@material-ui/icons/Pageview'
import UsersIcon from '@material-ui/icons/Group'
import ChartIcon from '@material-ui/icons/PieChart'
import DashIcon from '@material-ui/icons/Dashboard'
import { Link } from 'react-router-dom'

const links = [
  { text: 'Home Page', icon: <HomeIcon />, path: '/' },
  { text: 'Upload Product', icon: <UploadIcon />, path: '/upload' },
  { text: 'Sales', icon: <MoneyIcon />, path: '/sales' },
  { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Users', icon: <UsersIcon />, path: '/users' },
  { text: 'Charts', icon: <ChartIcon />, path: '/charts' }
]

const RootMenu = () => (
  <List component="nav">
    {links.map(l => (
      <ListItem key={l.text} button component={Link} to={l.path}>
        <ListItemIcon>{l.icon}</ListItemIcon>
        <ListItemText primary={l.text} />
      </ListItem>
    ))}
    <ListItem
      button
      component="a"
      href="https://dashboard.stripe.com/dashboard"
      target="_blank"
    >
      <ListItemIcon>
        <DashIcon />
      </ListItemIcon>
      <ListItemText primary="Stripe Dash" />
    </ListItem>
  </List>
)

export default RootMenu
