import React from 'react'
import { Route, Redirect } from 'react-router-dom'

export const Admin = {
  isAdmin: false,
  enterAdminMode() {
    this.isAdmin = true
  },
  exitAdminMode() {
    this.isAdmin = false
  }
}

export const PrivateRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={routeProps =>
      Admin.isAdmin ? (
        renderMergedProps(component, routeProps, rest)
      ) : (
        <Redirect
          to={{ pathname: '/', state: { from: routeProps.location } }}
        />
      )
    }
  />
)

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)
  return React.createElement(component, finalProps)
}

export const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return renderMergedProps(component, routeProps, rest)
      }}
    />
  )
}
