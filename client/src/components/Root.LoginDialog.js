import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const ERROR_STYLE = {
  color: 'red',
  fontWeight: 'bold',
  backgroundColor: 'pink',
  textAlign: 'center',
  padding: '5px',
  marginTop: '2vh'
}

export default ({ open, username, password, handleChange, attemptLogin, error, message }) => {
  return(
    <Dialog open={open} transition={Transition}>
      <DialogTitle>Login Shopping Site Admin</DialogTitle>
      <DialogContent>
        <TextField
          type='text'
          name='username'
          label='Username'
          value={username}
          onChange={handleChange}
          fullWidth
        />
        <br/>
        <br/>
        <TextField
          type='password'
          name='password'
          label='Password'
          value={password}
          onChange={handleChange}
          fullWidth
        />
        <br/>
        {error && <DialogContentText style={ERROR_STYLE}>{message}</DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button 
          variant='raised'
          color='primary'
          onClick={attemptLogin}
          disabled={!username || !password}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
    )
}