import React, { Component } from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { GET_ALL_PRODUCTS_QUERY } from '../queries/getAllProducts'
import { S3_SIGN_MUTATION } from '../mutations/s3Sign'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import UploadDropzone from '../components/Upload.Dropzone'
import UploadForm from '../components/Upload.Form'
import axios from 'axios'
import { formatFilename } from '../utils/formatFilename'

const UPLOAD = {
  display: 'grid',
  gridTemplateColumns: '50% 50%'
}

class Upload extends Component {
  
  state = {
    files: [],
    images: [],
    variant: '',
    bead: '',
    title: '',
    description: '',
    price: '',
    stock: '',
    snackOpen: false,
    snackMessage: ''
  }
  
  uploadToS3 = async (file, requestUrl, index) => {
    const options = {
      headers: { 
        'Content-Type': file.type 
      },
      onUploadProgress: (progressEvent) => {
        var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
          this.setState({ [`progress-${index}`]: percentCompleted })
      }
    }
    await axios.put(requestUrl, file, options)
  }
  
  handleUpload = async () => {
    try {
      const { files } = this.state
      let filename, filetype, response, requestUrl
      const images = []
      await files.forEach( async (f,i) => {
        filename = formatFilename(f.name, 'images')
        filetype = f.type
        response = await this.props.s3Sign({
          variables: { filename, filetype }
        })
        requestUrl = response.data.s3Sign.requestUrl
        images.push(response.data.s3Sign.imageUrl)
        await this.uploadToS3(f, requestUrl, i)
      })
      await this.setState({ 
        images,
        snackOpen: true,
        snackMessage: 'Images successfully uploaded'
      })
    } catch(error) {
        await this.setState({
          snackOpen: true,
          snackMessage: 'Error: Image uploading'
        })
    }
  }
  
  addProduct = async () => {
    try {
      const { variant, bead, title, description, price, stock, images } = this.state
      const parsedPrice = parseFloat(price.replace(/,/g,'').slice(2))
      await this.props.createProduct({
        variables: { input: { variant, bead, title, description, stock, images, price: parsedPrice }},
        refetchQueries: [{ query: GET_ALL_PRODUCTS_QUERY }]
      })
      await this.setState({
        files: [],
        images: [],
        variant: '',
        bead: '',
        title: '',
        description: '',
        price: '',
        stock: '',
        snackOpen: true,
        snackMessage: 'Product successfully created'
      })
    } catch(error) {
        await this.setState({
          snackOpen: true,
          snackMessage: 'Error: Product Creation'
        })
    }

  }
  
  handleChange = e => {
    const { name, value } = e.target
    if(name === 'stock') {
      if(value < 0) {
        this.setState({ stock: 0 })
        return
      }
    }
    this.setState({ [name]: value })
  }
  
  handleDrop = async (files) => {
    await this.setState({ files })
    for(let i = 0; i < files.length; i++) {
      await this.setState({ [`progress-${i}`]: 0 })
    }
  }
  
  resetForm = () => this.setState({ variant: '', bead: '', title: '', description: '', price: '', stock: '' })
  
  handleClose = (e, reason) => {
    if(reason === 'clickaway') return
    this.setState({ snackOpen: false })
  } 
  
  render() {
    return(
      <div style={UPLOAD}>
        <UploadDropzone
          handleDrop={this.handleDrop}
          handleUpload={this.handleUpload}
          files={this.state.files}
          state={this.state}
        />
        <UploadForm
          handleChange={this.handleChange}
          addProduct={this.addProduct}
          resetForm={this.resetForm}
          variant={this.state.variant}
          bead={this.state.bead}
          title={this.state.title}
          description={this.state.description}
          price={this.state.price}
          stock={this.state.stock}
          images={this.state.images}
        />
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={this.state.snackOpen}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message={<span>{this.state.snackMessage}</span>}
          action={<IconButton
                    key="close"
                    color="inherit"
                    onClick={this.handleClose}
                  >
                    <CloseIcon />
                  </IconButton>}
        />
      </div>
      )
  }
}

const CREATE_PRODUCT_MUTATION = gql`
  mutation($input: ProductInput!) {
    createProduct(input: $input) {
      id
    }
  }
`

export default compose(
  graphql(S3_SIGN_MUTATION, { name: 's3Sign' }),
  graphql(CREATE_PRODUCT_MUTATION, { name: 'createProduct' })
  )(Upload)