import { button } from "../buttons";

const ModalFooter = ({ cancel, confirm, onCancel, onConfirm }) => {
    return (
        <>
            <div className="flex justify-end gap-2">
                <button
                    onClick={onCancel}
                    className={button({ color: "secondary", className: 'w-[80px] h-[40px]' })}
                >
                    {cancel}
                </button>

                <button
                    onClick={onConfirm}
                    className={button({ color: "primary", className: 'w-[80px] h-[40px]' })}
                >
                    {confirm}
                </button>
            </div>
        </>
    )
}

export default ModalFooter;