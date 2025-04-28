import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const StartOptionsPopup = ({ show, onClose, onOptionSelect }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Start Journey Options</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Choose how you want to start your journey:</p>
        <div className="d-grid gap-2">
          <Button variant="primary" onClick={() => onOptionSelect('reach_source')}>
            First Reach Source
          </Button>
          <Button variant="success" onClick={() => onOptionSelect('shortest_path')}>
            Shortest Road to Destination
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default StartOptionsPopup;
