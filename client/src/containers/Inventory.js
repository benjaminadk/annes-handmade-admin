import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { GET_ALL_PRODUCTS_QUERY } from '../apollo/queries/getAllProducts'
import { DELETE_PRODUCT_MUTATION } from '../apollo/mutations/deleteProduct'
import { graphql, compose } from 'react-apollo'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import CloseIcon from '@material-ui/icons/Close'
import PhotoIcon from '@material-ui/icons/CameraRoll'
import NoteIcon from '@material-ui/icons/Note'
import InventoryDialog from '../components/Inventory.Dialog'
import Loading from '../components/Loading'
import ReactTable from 'react-table'
import LightBox from 'react-images'
import { beads } from '../utils/beads'
import matchSorter from 'match-sorter'

const styles = theme => ({
  infoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '3vh'
  },
  info: {
    width: '25vw',
    padding: '.5vw'
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1vh',
    marginBottom: '2vh'
  },
  image: {
    height: '10vh',
    width: '10vh',
    marginRight: '1vw',
    border: '1px solid grey',
    cursor: 'pointer'
  },
  description: {
    margin: '2vh',
    padding: '1vh'
  },
  header: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontWeight: 'bold'
  }
})

class Inventory extends Component {
  state = {
    detailsMode: false,
    open: false,
    product: null,
    isOpen: false,
    images: [],
    imageIndex: 0
  }

  deleteProduct = async props => {
    const proceed = window.confirm(`Delete Product - ${props.original.title} ?`)
    if (!proceed) return
    const images = []
    props.original.images.forEach(i => {
      let obj = Object.assign({}, { Key: i.slice(39) })
      images.push(obj)
    })
    await this.props.deleteProduct({
      variables: { productId: props.value, images },
      refetchQueries: [{ query: GET_ALL_PRODUCTS_QUERY }]
    })
  }

  editProduct = async productId => {
    const product = this.props.data.getAllProducts.filter(
      p => p.id === productId
    )
    await this.setState({ open: true, product })
  }

  closeDialog = () => this.setState({ open: false })

  toggleExpander = bool => this.setState({ detailsMode: bool })

  getOutOfStock = products => {
    var out = 0
    products.forEach(p => {
      if (p.stock === 0) {
        out += 1
      }
    })
    return out
  }

  getInStockValue = products => {
    var total = 0
    products.forEach(p => {
      if (p.stock > 0) {
        total += p.price
      }
    })
    return total.toFixed(2)
  }

  getAveragePrice = products => {
    var totalProducts = products.length
    var totalValue = this.getInStockValue(products)
    var averagePrice = totalValue / totalProducts
    return averagePrice.toFixed(2)
  }

  openLightbox = arr => {
    const images = []
    arr.forEach(a => {
      let obj = Object.assign({}, { src: a })
      images.push(obj)
    })
    this.setState({ images, isOpen: true })
  }

  closeLightbox = () => this.setState({ isOpen: false, images: [] })

  gotoNext = () => {
    this.setState({ imageIndex: this.state.imageIndex + 1 })
  }

  gotoPrevious = () => {
    this.setState({ imageIndex: this.state.imageIndex - 1 })
  }

  render() {
    const {
      data: { loading, getAllProducts },
      classes
    } = this.props
    if (loading) return <Loading />
    const columns = [
      {
        Header: () => <div className={classes.header}>Stock</div>,
        accessor: 'stock',
        width: 75,
        filterable: false,
        Cell: props => <Typography variant="body2">{props.value}</Typography>
      },
      {
        Header: () => <div className={classes.header}>Name</div>,
        accessor: 'title',
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ['title'] }),
        filterAll: true,
        Cell: props => <Typography variant="body2">{props.value}</Typography>
      },
      {
        Header: () => <div className={classes.header}>Bead</div>,
        accessor: 'bead',
        width: 175,
        filterMethod: (filter, row) => {
          if (filter.value === 'all') return true
          return row[filter.id] === Number(filter.value)
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: '100%' }}
            value={filter ? filter.value : 'all'}
          >
            <option value="all">Show All</option>
            <option value={1}>Red Jasper</option>
            <option value={2}>Fancy Jasper</option>
            <option value={3}>Mustang Jasper</option>
            <option value={4}>Leopard Jasper</option>
            <option value={5}>Aventurine</option>
            <option value={6}>Carnelian</option>
            <option value={7}>Saguaro</option>
            <option value={8}>Black Onyx</option>
            <option value={9}>Amethyst</option>
            <option value={10}>Rose Quartz</option>
            <option value={11}>Chalk Turquoise</option>
            <option value={12}>Swarovski Crystal</option>
            <option value={13}>Yellow Jade</option>
            <option value={14}>Red Creek Jasper</option>
          </select>
        ),
        Cell: props => (
          <Typography variant="body2">{beads[props.value - 1]}</Typography>
        )
      },
      {
        Header: () => <div className={classes.header}>Type</div>,
        accessor: 'variant',
        width: 125,
        filterMethod: (filter, row) => {
          if (filter.value === 'all') return true
          return row[filter.id] === Number(filter.value)
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: '100%' }}
            value={filter ? filter.value : 'all'}
          >
            <option value="all">Show All</option>
            <option value={1}>Necklace</option>
            <option value={2}>Bracelet</option>
            <option value={3}>Earrings</option>
          </select>
        ),
        Cell: props => (
          <Typography variant="body2">
            {props.value === 1
              ? 'Necklace'
              : props.value === 2
                ? 'Bracelet'
                : props.value === 3
                  ? 'Earrings'
                  : 'Unknown'}
          </Typography>
        )
      },
      {
        Header: () => <div className={classes.header}>Details</div>,
        expander: true,
        width: 75,
        Expander: ({ isExpanded, ...rest }) => (
          <Tooltip title="Click to view description">
            <div onMouseEnter={() => this.toggleExpander(true)}>
              {isExpanded && this.state.detailsMode ? (
                <CloseIcon />
              ) : (
                <NoteIcon />
              )}
            </div>
          </Tooltip>
        ),
        style: { cursor: 'pointer', display: 'flex', justifyContent: 'center' }
      },
      {
        Header: () => <div className={classes.header}>Price</div>,
        accessor: 'price',
        width: 75,
        filterable: false,
        Cell: props => <Typography variant="body2">$ {props.value}</Typography>
      },
      {
        Header: () => <div className={classes.header}>Images</div>,
        expander: true,
        width: 75,
        Expander: ({ isExpanded, ...rest }) => (
          <Tooltip title="Click to view images">
            <div onMouseEnter={() => this.toggleExpander(false)}>
              {isExpanded && !this.state.detailsMode ? (
                <CloseIcon />
              ) : (
                <PhotoIcon />
              )}
            </div>
          </Tooltip>
        ),
        style: { cursor: 'pointer', display: 'flex', justifyContent: 'center' }
      },
      {
        Header: () => <div className={classes.header}>Edit</div>,
        accessor: 'id',
        width: 75,
        filterable: false,
        Cell: props => (
          <div>
            <Button
              variant="raised"
              color="primary"
              size="small"
              onClick={() => this.editProduct(props.value)}
            >
              Edit
            </Button>
          </div>
        )
      },
      {
        Header: () => <div className={classes.header}>Delete</div>,
        accessor: 'id',
        width: 75,
        filterable: false,
        Cell: props => (
          <div>
            <Button
              variant="raised"
              size="small"
              style={{ backgroundColor: '#ff5b5b', color: 'white' }}
              onClick={() => this.deleteProduct(props)}
            >
              Delete
            </Button>
          </div>
        )
      }
    ]
    return [
      <div key="main">
        <Typography variant="display2" align="center">
          Inventory
        </Typography>
        <div className={classes.infoContainer}>
          <Paper className={classes.info}>
            <div className={classes.infoItem}>
              <Typography variant="body2">Out of Stock Products</Typography>
              <Typography variant="title">
                {this.getOutOfStock(getAllProducts)}
              </Typography>
            </div>
            <div className={classes.infoItem}>
              <Typography variant="body2">Total Product Count</Typography>
              <Typography variant="title">{getAllProducts.length}</Typography>
            </div>
            <div className={classes.infoItem}>
              <Typography variant="body2">Average Product Price</Typography>
              <Typography variant="title">
                $ {this.getAveragePrice(getAllProducts)}
              </Typography>
            </div>
            <div className={classes.infoItem}>
              <Typography variant="body2">In Stock Total Value</Typography>
              <Typography variant="title">
                $ {this.getInStockValue(getAllProducts)}
              </Typography>
            </div>
          </Paper>
        </div>
        <br />
        <ReactTable
          data={getAllProducts}
          columns={columns}
          defaultSorted={[{ id: 'title', asc: true }]}
          className="-striped -highlight"
          showPaginationTop
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value
          }
          getTrProps={(state, rowInfo, column) => {
            return {
              style: {
                background: rowInfo && rowInfo.row.stock === 0 && '#ffb5b5'
              }
            }
          }}
          SubComponent={row => {
            if (this.state.detailsMode) {
              return (
                <div>
                  <Paper elevation={4} className={classes.description}>
                    <Typography variant="title">Description</Typography>
                    <Typography variant="body1">
                      {row.original.description}
                    </Typography>
                  </Paper>
                </div>
              )
            } else {
              return (
                <div className={classes.imageContainer}>
                  {row.original.images.map((im, i, a) => (
                    <img
                      key={i}
                      alt="prod"
                      src={im}
                      onClick={() => this.openLightbox(a)}
                      className={classes.image}
                    />
                  ))}
                </div>
              )
            }
          }}
        />
      </div>,
      <InventoryDialog
        key="dialog"
        open={this.state.open}
        product={this.state.product}
        onClose={this.closeDialog}
      />,
      <LightBox
        key="light-box"
        isOpen={this.state.isOpen}
        images={this.state.images}
        currentImage={this.state.imageIndex}
        onClose={this.closeLightbox}
        onClickPrev={this.gotoPrevious}
        onClickNext={this.gotoNext}
      />
    ]
  }
}

export default compose(
  withStyles(styles),
  graphql(GET_ALL_PRODUCTS_QUERY),
  graphql(DELETE_PRODUCT_MUTATION, { name: 'deleteProduct' })
)(Inventory)
