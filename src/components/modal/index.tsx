import { FC } from "react";
import { Button, Modal } from "react-bootstrap";

interface ModalProps {
  title: string;
  body: string;
  isOpen: boolean;
  handleClose: () => void;
}

const ModalBasic: FC<ModalProps> = ({ isOpen, title, body, handleClose }) => {
  return (
    <>
      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalBasic;
