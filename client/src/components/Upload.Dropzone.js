import React from 'react'
import Dropzone from 'react-dropzone'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Tooltip from '@material-ui/core/Tooltip'
import LinearProgress from '@material-ui/core/LinearProgress'

const THUMB = {
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  height: '10vh',
  width: '10vh',
  border: '1px solid'
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  dropzone: {
    height: '40vh',
    width: '75%',
    border: '1px dashed',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  card: {
    width: '90%',
    marginTop: theme.spacing.unit * 3
  },
  file: {
    display: 'flex',
    alignItems: 'center'
  },
  fileInfo: {
    marginLeft: theme.spacing.unit
  },
  progress: {
    marginTop: theme.spacing.unit
  },
  divider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
})

const UploadDropzone = ({ files, handleDrop, handleUpload, classes, state }) => {
  return(
    <div className={classes.container}>
      <Dropzone
        onDrop={handleDrop}
        accept='image/*'
        multiple={true}
        className={classes.dropzone}
      >
        <Typography variant='body2'>1 - Click or Drag and Drop Images</Typography>
        <Typography variant='body2'>2 - Click Upload Button</Typography>
        <Typography variant='body2'>3 - Fill out Form</Typography>
        <Typography variant='body2'>4 - Click Create Product Button</Typography>
      </Dropzone>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant='title'>Images to Upload</Typography>
          <br/>
          {files.map((f,i) => (
            <div key={`file-item-${i}`}>
              <div className={classes.file}>
                <div style={Object.assign({}, THUMB, { backgroundImage: `url(${f.preview})`})}></div>
                <div className={classes.fileInfo}>
                  <Tooltip title={f.name}>
                    <Typography variant='body2'>
                      Filename: {f.name.length > 25 ? `${f.name.slice(0,25)}...` : f.name}
                    </Typography>
                  </Tooltip>
                  <Typography variant='caption'>Size: {f.size} bytes</Typography>
                </div>
              </div>
              <LinearProgress
                variant='determinate'
                value={state[`progress-${i}`] || 0}
                className={classes.progress}
              />
              <Divider className={classes.divider}/>
            </div>
          ))}
        </CardContent>
        <CardActions>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0}
            variant='raised'
            color='primary'
            fullWidth
          >
            Upload Images to S3
          </Button>
        </CardActions>
      </Card>
    </div>
    )
}

export default withStyles(styles)(UploadDropzone)