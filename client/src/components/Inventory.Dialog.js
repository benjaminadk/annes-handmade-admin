import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { GET_ALL_PRODUCTS_QUERY } from '../queries/getAllProducts'
import { S3_SIGN_MUTATION } from '../mutations/s3Sign'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import UploadDropzone from './Upload.Dropzone'
import axios from 'axios'
import { formatFilename } from '../utils/formatFilename'
import { beads } from '../utils/beads'

const numberMask = createNumberMask({
  prefix: '$ ',
  allowDecimal: true,
  requireDecimal: true
})

function PriceMask(props) {
  const { inputRef, ...other } = props
  return <MaskedInput {...other} ref={inputRef} mask={numberMask} />
}

const styles = theme => ({
  content: {
    display: 'grid',
    gridTemplateColumns: '50% 50%'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  images: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  imageComponent: {
    height: '30vh',
    width: '20vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: '2vw'
  },
  image: {
    height: '20vh',
    width: '20vh',
    border: '1px solid black'
  },
  deleteButton: {
    backgroundColor: '#ff3232',
    color: 'white',
    width: '20vh',
    marginTop: '1vh'
  }
})

class InventoryDialog extends Component {
  state = {
    variant: '',
    bead: '',
    title: '',
    description: '',
    price: '',
    stock: '',
    images: [],
    files: []
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (!prevProps.product && this.props.product) ||
      (prevProps.product && prevProps.product !== this.props.product)
    ) {
      const {
        variant,
        bead,
        title,
        description,
        price,
        stock,
        images
      } = this.props.product[0]
      this.setState({
        variant,
        bead,
        title,
        description,
        price: `$ ${price.toFixed(2)}`,
        stock,
        images,
        files: []
      })
    }
  }

  handleUpdate = async () => {
    const {
      variant,
      bead,
      title,
      description,
      price,
      stock,
      images
    } = this.state
    const parsedPrice = parseFloat(price.slice(2))
    const input = {
      variant,
      bead,
      title,
      description,
      price: parsedPrice,
      stock,
      images
    }
    const productId = this.props.product[0].id
    await this.props.updateProduct({
      variables: { productId, input },
      refetchQueries: [{ query: GET_ALL_PRODUCTS_QUERY }]
    })
    this.props.onClose()
  }

  handleDelete = async image => {
    const productId = this.props.product[0].id
    await this.props.deleteImage({
      variables: { productId, image: image.slice(39) },
      refetchQueries: [{ query: GET_ALL_PRODUCTS_QUERY }]
    })
    const filteredImages = this.state.images.filter(im => im !== image)
    this.setState({ images: filteredImages })
  }

  handleDrop = async files => {
    await this.setState({ files })
    for (let i = 0; i < files.length; i++) {
      await this.setState({ [`progress-${i}`]: 0 })
    }
  }

  uploadToS3 = async (file, requestUrl, index) => {
    const options = {
      headers: {
        'Content-Type': file.type
      },
      onUploadProgress: progressEvent => {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        this.setState({ [`progress-${index}`]: percentCompleted })
      }
    }
    await axios.put(requestUrl, file, options)
  }

  handleUpload = async () => {
    try {
      const { files } = this.state
      let filename, filetype, requestUrl
      const images = [...this.state.images]
      // had issue with making function inside of forEach async - state was not accurate
      // switched to then with promises and it seems to give accurate images state
      files.forEach((f, i) => {
        filename = formatFilename(f.name, 'images')
        filetype = f.type
        this.props
          .s3Sign({
            variables: { filename, filetype }
          })
          .then(response => {
            requestUrl = response.data.s3Sign.requestUrl
            images.push(response.data.s3Sign.imageUrl)
            this.uploadToS3(f, requestUrl, i)
          })
          .then(() => this.setState({ images }))
      })
    } catch (error) {
      console.log(error)
    }
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  handleClose = () => this.setState({ snackOpen: false })

  render() {
    const { open, product, onClose, classes } = this.props
    if (product) {
      return (
        <Dialog key="dialog" open={open} onClose={onClose} fullScreen>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent className={classes.content}>
            <div>
              <div className={classes.images}>
                {this.state.images &&
                  this.state.images.map((image, index) => (
                    <div key={index} className={classes.imageComponent}>
                      <img src={image} alt="thumb" className={classes.image} />
                      <Button
                        variant="raised"
                        size="small"
                        className={classes.deleteButton}
                        onClick={() => this.handleDelete(image)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
              </div>
              <UploadDropzone
                handleDrop={this.handleDrop}
                handleUpload={this.handleUpload}
                files={this.state.files}
                state={this.state}
              />
            </div>
            <div className={classes.form}>
              <FormControl>
                <InputLabel htmlFor="variant">Item Style</InputLabel>
                <Select
                  value={this.state.variant}
                  onChange={this.handleChange}
                  inputProps={{ name: 'variant', id: 'variant' }}
                >
                  <MenuItem value={1}>Necklace</MenuItem>
                  <MenuItem value={2}>Bracelet</MenuItem>
                  <MenuItem value={3}>Earings</MenuItem>
                </Select>
              </FormControl>
              <br />
              <FormControl>
                <InputLabel htmlFor="bead">Bead Type</InputLabel>
                <Select
                  value={this.state.bead}
                  onChange={this.handleChange}
                  inputProps={{ name: 'bead', id: 'bead' }}
                >
                  {beads.map((b, i) => (
                    <MenuItem key={b} value={i + 1}>
                      {b}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br />
              <TextField
                name="title"
                onChange={this.handleChange}
                value={this.state.title}
                label="Item Title"
              />
              <br />
              <TextField
                name="description"
                onChange={this.handleChange}
                value={this.state.description}
                label="Item Description"
                multiline
                rows={3}
              />
              <br />
              <FormControl>
                <InputLabel>Item Price</InputLabel>
                <Input
                  name="price"
                  onChange={this.handleChange}
                  value={this.state.price}
                  inputComponent={PriceMask}
                />
              </FormControl>
              <br />
              <TextField
                name="stock"
                onChange={this.handleChange}
                value={this.state.stock}
                label="Item Stock"
                type="number"
              />
              <br />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              variant="raised"
              size="large"
              color="primary"
              onClick={this.handleUpdate}
            >
              Update Product
            </Button>
            <Button variant="raised" size="large" onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )
    } else {
      return null
    }
  }
}

const UPDATE_PRODUCT_MUTATION = gql`
  mutation($productId: ID!, $input: ProductInput!) {
    updateProduct(productId: $productId, input: $input) {
      success
    }
  }
`

const DELETE_IMAGE_MUTATION = gql`
  mutation($productId: ID!, $image: String!) {
    deleteImage(productId: $productId, image: $image) {
      success
    }
  }
`

export default compose(
  withStyles(styles),
  graphql(S3_SIGN_MUTATION, { name: 's3Sign' }),
  graphql(UPDATE_PRODUCT_MUTATION, { name: 'updateProduct' }),
  graphql(DELETE_IMAGE_MUTATION, { name: 'deleteImage' })
)(InventoryDialog)
