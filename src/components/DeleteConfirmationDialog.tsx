import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "react-bootstrap";
import { PiTrashFill } from "react-icons/pi";

interface Props {
  onDelete: () => void;
}

const DeleteConfirmationDialog: React.FC<Props> = ({ onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setOpen(false);
  };

  return (
    <>
      <PiTrashFill
        className="delete-icon"
        size={35}
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="delete-dialog"
        PaperProps={{
          sx: {
            backgroundColor: "#303030",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          className="delete-dialog"
          sx={{ color: "white" }}
        >
          Delete Category?
        </DialogTitle>
        <DialogContent className="delete-dialog">
          <DialogContentText
            id="alert-dialog-description"
            className="delete-dialog"
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            Are you sure you want to delete this course category and all its
            courses?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outline-light" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="light" onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteConfirmationDialog;
