const MyContainer = ({ title, component }) => {
    return (
        <>
            <h2 className="text-xl font-semibold mb-5">{title}</h2>

            <div className="border border-gray-200 rounded-2xl px-10 py-7 shadow-md">
                {component}
            </div>
        </>
    )
}

export default MyContainer;