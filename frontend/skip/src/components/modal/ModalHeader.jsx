import ModalClose from "./ModalClose";

const ModalHeader = ({ title, onClose }) => {
    return (
        <div className="flex items-start justify-between">
            <h2 id="modalTitle" className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>

            <ModalClose onClick={onClose}></ModalClose>
        </div>
    )
}

export default ModalHeader;