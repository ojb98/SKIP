import { useState } from "react";

const RefundRequestModal = ({ onClose, onSubmit }) => {

    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        if (!reason.trim()) {
            alert("환불 사유를 입력해주세요.");
            return;
        }
        onSubmit(reason);
    };


    return (
        <div style={{ backgroundColor: "rgba(0,0,0,0.3)" }} className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-8 shadow-lg w-96 max-w-[90%] text-center">
                <h3 className="text-xl font-semibold mb-5">환불 사유 입력</h3>
                <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded-md p-3 resize-none mb-6"
                    placeholder="환불 사유를 입력해주세요..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};
export default RefundRequestModal;