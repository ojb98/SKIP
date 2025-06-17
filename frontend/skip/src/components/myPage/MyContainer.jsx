import clsx from "clsx";

const MyContainer = ({ title, children, className }) => {
    return (
        <>
            <h2 className="text-xl font-semibold mb-5">{title}</h2>
            
            <div className={clsx('border border-gray-200 rounded-2xl shadow-md', className || 'px-10 py-7')}>
                {children}
            </div>
        </>
    )
}

export default MyContainer;