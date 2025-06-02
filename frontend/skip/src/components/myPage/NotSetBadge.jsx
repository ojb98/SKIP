const NotSetBadge = ({ styleClass = '' }) => {
    return (
        <>
            <span className={`text-white text-xs bg-gray-300 rounded-2xl px-3 py-2 ${styleClass}`}>없음</span>
        </>
    )
}

export default NotSetBadge;