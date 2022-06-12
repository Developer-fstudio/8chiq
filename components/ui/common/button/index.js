

export default function CustomeButton({
    onClick,
    children, 
    disabled = false,
    hoverable = true,
    className,
    variant = "purple"
    }) {

    const variants = {
        purple: `dark:bg-purple-600 ${hoverable && "dark:hover:bg-purple-700 hover:bg-purple-800"} dark:focus:ring-purple-800 focus:ring-purple-300 text-white bg-purple-700`,
        blue: `dark:bg-blue-600 ${hoverable && "dark:hover:bg-blue-700 hover:bg-blue-800"} dark:focus:ring-blue-800 focus:ring-blue-300 text-white bg-blue-700`,
        red: `dark:bg-red-600 ${hoverable && "dark:hover:bg-red-700 hover:bg-red-800"} dark:focus:ring-red-800 focus:ring-red-300 text-white bg-red-700`,
    }

    return (
    <button 
        onClick={onClick}
        disabled={disabled}
        type="button" className={`disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4  font-medium rounded-md lg:text-sm text-xs px-3 lg:px-5 py-2.5 text-center mr-2 ${className} ${variants[variant]}`}>
            {children}
    </button>
    )
}