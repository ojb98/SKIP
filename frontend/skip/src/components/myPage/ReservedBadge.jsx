const ReservedBadge = ({ children }) => {
    return (
        <>
            <span
                className="inline-flex items-center justify-center rounded-full border border-emerald-500 px-2.5 py-0.5 text-emerald-700"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="-ms-1 me-1.5 size-4"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>

                <p className="text-sm whitespace-nowrap">{children}</p>
            </span>
        </>
    )
};

export default ReservedBadge;