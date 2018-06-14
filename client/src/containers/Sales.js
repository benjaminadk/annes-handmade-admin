import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import PersonIcon from '@material-ui/icons/Person'
import CloseIcon from '@material-ui/icons/Close'
import ProductIcon from '@material-ui/icons/ShoppingCart'
import NoteIcon from '@material-ui/icons/Note'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import _ from 'lodash'
import { formatDate } from '../utils/formatDate'

const styles = theme => ({
  shipped: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  totalFooter: {
    fontWeight: 'bold'
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  image: {
    height: '7vh',
    width: '7vh',
    border: '1px solid grey'
  },
  notes: {
    margin: '2vh',
    padding: '1vh'
  },
  header: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontWeight: 'bold'
  },
  prodHeader: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#3f51b5',
    padding: 2
  },
  custMainHeader: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#3f51b5',
    padding: 2
  },
  custSubHeader: {
    fontFamily: 'Roboto, Arial, sans-serif'
  }
})

class Sales extends Component {
  state = {
    customerMode: false
  }

  handleToggleShipped = async (saleId, status) => {
    await this.props.toggleShipped({
      variables: { saleId, status },
      refetchQueries: [{ query: GET_ALL_SALES_QUERY }]
    })
  }

  toggleExpander = bool => this.setState({ customerMode: bool })

  getPending = sales => {
    var pending = 0
    sales.forEach(s => {
      if (!s.shipped) {
        pending += 1
      }
    })
    return pending
  }

  render() {
    const {
      data: { loading, getAllSales },
      classes
    } = this.props
    if (loading) return null
    const columns = [
      {
        Header: () => <div className={classes.header}>Order Date</div>,
        accessor: 'createdOn',
        width: 100,
        Cell: props => (
          <Typography variant="body2">{formatDate(props.value)}</Typography>
        )
      },
      {
        Header: () => <div className={classes.header}>Shipped</div>,
        accessor: 'shipped',
        Cell: props => (
          <div className={classes.shipped}>
            <Typography variant="body2">
              {props.value ? 'Yes' : 'No'}
            </Typography>
            <Button
              variant="raised"
              color={props.value ? 'primary' : 'secondary'}
              size="small"
              onClick={() =>
                this.handleToggleShipped(
                  props.original.id,
                  props.value ? false : true
                )
              }
            >
              {props.value ? 'Mark as NOT Shipped' : 'Mark as Shipped'}
            </Button>
          </div>
        )
      },
      {
        Header: () => <div className={classes.header}>Customer</div>,
        expander: true,
        width: 85,
        Expander: ({ isExpanded, ...rest }) => (
          <div onMouseEnter={() => this.toggleExpander(true)}>
            {isExpanded && this.state.customerMode ? (
              <CloseIcon />
            ) : (
              <PersonIcon />
            )}
          </div>
        ),
        style: {
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center'
        }
      },
      {
        Header: () => <div className={classes.header}>Pieces</div>,
        accessor: 'quantity',
        width: 75,
        Cell: props => (
          <Typography variant="body2">
            {_.reduce(
              props.value,
              function(sum, n) {
                return sum + n
              },
              0
            )}
          </Typography>
        )
      },
      {
        Header: () => <div className={classes.header}>Products</div>,
        expander: true,
        width: 75,
        Expander: ({ isExpanded, ...rest }) => (
          <div onMouseEnter={() => this.toggleExpander(false)}>
            {isExpanded && !this.state.customerMode ? (
              <CloseIcon />
            ) : (
              <ProductIcon />
            )}
          </div>
        ),
        style: {
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center'
        }
      },
      {
        Header: () => <div className={classes.header}>Total</div>,
        accessor: 'total',
        width: 150,
        Cell: props => (
          <Typography variant="body2">{`$ ${props.value}`}</Typography>
        ),
        Footer: (
          <Typography variant="body1">
            <span className={classes.totalFooter}>Sales Total: </span>
            {`$ ${_
              .reduce(
                _.map(getAllSales, d => d.total),
                function(sum, n) {
                  return sum + n
                },
                0
              )
              .toFixed(2)}`}
          </Typography>
        )
      }
    ]
    const columns2 = [
      {
        Header: () => <div className={classes.custMainHeader}>Customer</div>,
        columns: [
          {
            Header: () => <div className={classes.custSubHeader}>First</div>,
            accessor: 'firstName',
            Cell: props => (
              <Typography variant="body2">{props.value}</Typography>
            )
          },
          {
            Header: () => <div className={classes.custSubHeader}>Last</div>,
            accessor: 'lastName',
            Cell: props => (
              <Typography variant="body2">{props.value}</Typography>
            )
          },
          {
            Header: () => <div className={classes.custSubHeader}>Email</div>,
            accessor: 'email',
            Cell: props => (
              <Typography variant="body2">{props.value}</Typography>
            )
          }
        ]
      },
      {
        Header: () => <div className={classes.custMainHeader}>Address</div>,
        columns: [
          {
            Header: () => <div className={classes.custSubHeader}>Street</div>,
            accessor: 'street1',
            Cell: props => (
              <Typography variant="body2">{props.value}</Typography>
            )
          },
          {
            Header: () => <div className={classes.custSubHeader}>Apt</div>,
            accessor: 'street2',
            Cell: props => (
              <Typography variant="body2">{props.value}</Typography>
            )
          },
          {
            Header: () => <div className={classes.custSubHeader}>City</div>,
            accessor: 'city',
            Cell: props => (
              <Typography variant="body2">{props.value}</Typography>
            )
          },
          {
            Header: () => <div className={classes.custSubHeader}>State</div>,
            accessor: 'state',
            Cell: props => (
              <Typography variant="body2">{props.value}</Typography>
            )
          },
          {
            Header: () => <div className={classes.custSubHeader}>Zip</div>,
            accessor: 'zip',
            Cell: props => (
              <Typography variant="body2">{props.value}</Typography>
            )
          },
          {
            Header: () => <div className={classes.custSubHeader}>Notes</div>,
            expander: true,
            width: 75,
            Expander: ({ isExpanded, ...rest }) => (
              <div>{isExpanded ? <CloseIcon /> : <NoteIcon />}</div>
            ),
            style: {
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center'
            }
          }
        ]
      }
    ]
    const columns3 = [
      {
        Header: () => <div className={classes.prodHeader}>Count</div>,
        accessor: 'quantity',
        Cell: props => <Typography variant="body2">{props.value}</Typography>
      },
      {
        Header: () => <div className={classes.prodHeader}>Type</div>,
        accessor: 'variant',
        Cell: props => (
          <Typography variant="body2">
            {props.value === 1
              ? 'Necklace'
              : props.value === 2
                ? 'Bracelet'
                : props.value === 3
                  ? 'Earings'
                  : 'Unknown'}
          </Typography>
        )
      },
      {
        Header: () => <div className={classes.prodHeader}>Name</div>,
        accessor: 'title',
        Cell: props => <Typography variant="body2">{props.value}</Typography>
      },
      {
        Header: () => <div className={classes.prodHeader}>Details</div>,
        expander: true,
        width: 75,
        Expander: ({ isExpanded, ...rest }) => (
          <div>{isExpanded ? <CloseIcon /> : <NoteIcon />}</div>
        ),
        style: {
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center'
        }
      },
      {
        Header: () => <div className={classes.prodHeader}>Image</div>,
        accessor: 'images',
        width: 75,
        Cell: props => (
          <div className={classes.imageContainer}>
            <img alt="product" src={props.value[0]} className={classes.image} />
          </div>
        )
      },
      {
        Header: () => <div className={classes.prodHeader}>Price</div>,
        accessor: 'price',
        Cell: props => (
          <Typography variant="body2">{`$ ${props.value}`}</Typography>
        )
      }
    ]
    return (
      <div>
        <Typography variant="display2" align="center">
          Sales
        </Typography>
        <Typography variant="title" align="center">
          Orders To Ship: {this.getPending(getAllSales)}
        </Typography>
        <br />
        <ReactTable
          data={getAllSales}
          columns={columns}
          defaultSorted={[{ id: 'createdOn', desc: true }]}
          SubComponent={row => {
            if (this.state.customerMode) {
              return (
                <div>
                  <ReactTable
                    data={[row.original.shippingAddress]}
                    columns={columns2}
                    showPagination={false}
                    defaultPageSize={1}
                    SubComponent={row => {
                      return (
                        <div>
                          <Paper elevation={4} className={classes.notes}>
                            <Typography variant="title">Notes</Typography>
                            <Typography variant="body1">
                              {row.original.notes}
                            </Typography>
                          </Paper>
                        </div>
                      )
                    }}
                  />
                </div>
              )
            } else {
              const temp = row.original.products.map((p, i) =>
                Object.assign({}, p, { quantity: row.original.quantity[i] })
              )
              return (
                <div>
                  <ReactTable
                    data={temp}
                    columns={columns3}
                    showPagination={false}
                    defaultPageSize={row.original.products.length}
                    SubComponent={row => {
                      return (
                        <div>
                          <Paper elevation={4} className={classes.notes}>
                            <Typography variant="title">Description</Typography>
                            <Typography variant="body1">
                              {row.original.description}
                            </Typography>
                          </Paper>
                        </div>
                      )
                    }}
                  />
                </div>
              )
            }
          }}
        />
      </div>
    )
  }
}

const GET_ALL_SALES_QUERY = gql`
  query {
    getAllSales {
      id
      products {
        variant
        title
        description
        images
        price
        stock
        createdOn
      }
      quantity
      total
      shippingAddress {
        title
        email
        firstName
        lastName
        street1
        street2
        city
        state
        zip
        notes
      }
      shipped
      createdOn
    }
  }
`

const TOGGLE_SHIPPED_MUTATION = gql`
  mutation($saleId: ID!, $status: Boolean!) {
    toggleShipped(saleId: $saleId, status: $status) {
      success
    }
  }
`

export default compose(
  withStyles(styles),
  graphql(GET_ALL_SALES_QUERY),
  graphql(TOGGLE_SHIPPED_MUTATION, { name: 'toggleShipped' })
)(Sales)
