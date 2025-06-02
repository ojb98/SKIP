import { Children, cloneElement } from "react";

const Modal = ({ children }) => {
    return (
        <div
            className={`fixed inset-0 z-50 place-content-center bg-black/50 p-4 grid`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalTitle"
        >
            {children}
        </div>
    )
}

export default Modal;