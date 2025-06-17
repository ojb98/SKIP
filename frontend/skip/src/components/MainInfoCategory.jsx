import { radio } from "./buttons";

const MainInfoCategory = ({ onClick }) => {
    return (
        <>
            <div className="w-full flex justify-center gap-20">
                <label htmlFor="ranking" className={radio({ color: "primary", className: 'w-25' })}>
                    <p>랭킹</p>

                    <input
                        type="radio"
                        id="ranking"
                        name="info"
                        value="ranking"
                        defaultChecked
                        onClick={onClick}
                        className="sr-only"
                    ></input>
                </label>

                <label htmlFor="forecast" className={radio({ color: "primary", className: 'w-25' })}>
                    <p>날씨</p>

                    <input
                        type="radio"
                        id="forecast"
                        name="info"
                        value="forecast"
                        onClick={onClick}
                        defaultChecked
                        className="sr-only"
                    ></input>
                </label>
            </div>
        </>
    )
};

export default MainInfoCategory;