import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function YesNoDialog({ open, onClose, onConfirm, message }) {
  return (
    <Dialog
      open={open}
      onClose={() => onClose('no')}
      aria-labelledby="yes-no-dialog-title"
    >
      <DialogTitle id="yes-no-dialog-title">Confirm Action</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose('no')} color="primary">
          No
        </Button>
        <Button onClick={() => onConfirm('yes')} color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { YesNoDialog };
