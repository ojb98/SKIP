import Select from "./Select";



const SelectLabel = ({ description, options, className }) => {
    return (
        <>
            <div className="w-fit">
                <span className="text-sm font-medium text-gray-700">{description}</span>

                <Select options={options} className={className}></Select>
            </div>
        </>
    )
};

export default SelectLabel;