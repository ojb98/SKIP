const MyContainer = ({ title, content }) => {
    return (
        <>
            <h2 className="text-xl font-semibold mb-5">{title}</h2>
            
            <div className="border border-gray-200 rounded-2xl px-10 py-7 shadow-md">
                {content}
            </div>
        </>
    )
}

export default MyContainer;