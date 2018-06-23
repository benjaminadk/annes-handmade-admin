import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.unit * 2,
    marginTop: '10vh'
  }
})

const UploadForm = ({
  handleChange,
  addProduct,
  resetForm,
  variant,
  title,
  bead,
  description,
  price,
  stock,
  images,
  classes
}) => {
  return (
    <div className={classes.form}>
      <Typography variant="display2" align="center" gutterBottom>
        Product Properties
      </Typography>
      <FormControl>
        <InputLabel htmlFor="variant">Item Style</InputLabel>
        <Select
          value={variant}
          onChange={handleChange}
          inputProps={{ name: 'variant', id: 'variant' }}
        >
          <MenuItem value={1}>Necklace</MenuItem>
          <MenuItem value={2}>Bracelet</MenuItem>
          <MenuItem value={3}>Earrings</MenuItem>
        </Select>
      </FormControl>
      <br />
      <FormControl>
        <InputLabel htmlFor="bead">Bead Type</InputLabel>
        <Select
          value={bead}
          onChange={handleChange}
          inputProps={{ name: 'bead', id: 'bead' }}
        >
          {beads.map((b, i) => (
            <MenuItem key={b} value={i + 1} dense>
              {b}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <TextField
        name="title"
        onChange={handleChange}
        value={title}
        label="Item Title"
      />
      <br />
      <TextField
        name="description"
        onChange={handleChange}
        value={description}
        label="Item Description"
        multiline
        rows={3}
      />
      <br />
      <FormControl>
        <InputLabel>Item Price</InputLabel>
        <Input
          name="price"
          onChange={handleChange}
          value={price}
          inputComponent={PriceMask}
        />
      </FormControl>
      <br />
      <TextField
        name="stock"
        onChange={handleChange}
        value={stock}
        label="Item Stock"
        type="number"
      />
      <br />
      <Button
        variant="raised"
        color="secondary"
        onClick={resetForm}
        disabled={!(variant || bead || title || description || price || stock)}
      >
        Reset Form
      </Button>
      <br />
      <Button
        variant="raised"
        color="primary"
        onClick={addProduct}
        disabled={
          !variant ||
          !bead ||
          !title ||
          !description ||
          !price ||
          !stock ||
          !images
        }
      >
        Create Product
      </Button>
    </div>
  )
}
export default withStyles(styles)(UploadForm)
