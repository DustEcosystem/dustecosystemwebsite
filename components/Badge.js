const Badge = ({category}) => {
    return (
        <div className="text-xs py-1 px-2 bg-[#90B578] rounded-md font-medium selectionColor text-white">
            {category}
        </div>
    )
}

export default Badge