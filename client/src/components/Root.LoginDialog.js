import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import Checkbox from '@material-ui/core/Checkbox'

const styles = theme => ({
  dialogRoot: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  },
  dialogPaper: {
    width: '30vw'
  },
  dialogTitle: {
    backgroundColor: theme.palette.primary.main
  },
  dialogText: {
    color: 'red',
    textAlign: 'center',
    marginTop: '2.5vh'
  },
  checkBox: {
    display: 'flex',
    alignItems: 'center'
  }
})

const LoginDialog = ({
  open,
  username,
  password,
  error,
  message,
  checked,
  handleChange,
  attemptLogin,
  handleCheckbox,
  classes
}) => {
  return (
    <Dialog
      open={open}
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth={false}
      classes={{ root: classes.dialogRoot, paper: classes.dialogPaper }}
    >
      <DialogTitle disableTypography classes={{ root: classes.dialogTitle }}>
        <Typography variant="headline" align="center" style={{ color: '#FFF' }}>
          Login
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          type="text"
          name="username"
          label="Username"
          value={username}
          onChange={handleChange}
          fullWidth
          style={{ marginTop: '2.5vh' }}
        />
        <br />
        <br />
        <TextField
          type="password"
          name="password"
          label="Password"
          value={password}
          onChange={handleChange}
          fullWidth
        />
        <br />
        <DialogContentText classes={{ root: classes.dialogText }}>
          {error && message}
        </DialogContentText>
        <div className={classes.checkBox}>
          <Checkbox checked={checked} onChange={handleCheckbox} />
          <Typography variant="body2">Remember Me</Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="raised"
          color="primary"
          onClick={attemptLogin}
          disabled={!username || !password}
          fullWidth
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default withStyles(styles)(LoginDialog)
