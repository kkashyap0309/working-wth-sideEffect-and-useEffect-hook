import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = function Modal({ children, showModal, onclosing }) {
  const dialog = useRef();
    
  useEffect(() => {
    if (showModal) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [showModal]);

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onclosing}>
      {showModal ? children : null}
    </dialog>,
    document.getElementById("modal")
  );
};

export default Modal;
