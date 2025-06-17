import Select from "./Select";



const SelectLabel = ({ description, selectRef, options, onChange, className }) => {
    return (
        <>
            <div className="w-fit">
                <span className="text-sm font-medium text-gray-700">{description}</span>

                <Select selectRef={selectRef} options={options} onChange={onChange} className={className}></Select>
            </div>
        </>
    )
};

export default SelectLabel;