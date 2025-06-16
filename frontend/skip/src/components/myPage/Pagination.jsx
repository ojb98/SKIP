import { Link } from "react-router-dom";
import { page } from "../buttons";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const Pagination = ({ pageNumber, totalPages, searchHandler }) => {
    const range = (start, end) => {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <>
            <ul className="flex justify-center gap-1 text-gray-900">
                <li>
                    <Link
                        onClick={() => searchHandler(0)}
                        className={page({ color: (pageNumber == 0 ? "arrow-inactive" : "arrow-active") })}
                    >
                        <ChevronsLeft size={16}></ChevronsLeft>
                    </Link>
                </li>

                <li>
                    <Link
                        onClick={() => searchHandler(Math.max(0, pageNumber - 4))}
                        className={page({ color: (pageNumber == 0 ? "arrow-inactive" : "arrow-active") })}
                    >
                        <ChevronLeft size={16}></ChevronLeft>
                    </Link>
                </li>

                {/* 숫자 페이지 */}
                {
                    range(Math.max(0, pageNumber - 3), Math.min(pageNumber + 3, totalPages - 1)).map(item => (
                        <li key={item}>
                            <Link
                                onClick={() => searchHandler(item)}
                                className={page({ color: (item == pageNumber ? "active" : "inactive") })}
                            >
                                {item + 1}
                            </Link>
                        </li>
                    ))
                }

                <li>
                    <Link
                        onClick={() => searchHandler(Math.min(pageNumber + 4, totalPages - 1))}
                        className={page({ color: (pageNumber == totalPages - 1 || totalPages == 0 ? "arrow-inactive" : "arrow-active") })}
                    >
                        <ChevronRight size={16}></ChevronRight>
                    </Link>
                </li>

                <li>
                    <Link
                        onClick={() => searchHandler(totalPages - 1)}
                        className={page({ color: (pageNumber == totalPages - 1 || totalPages == 0 ? "arrow-inactive" : "arrow-active") })}
                    >
                        <ChevronsRight size={16}></ChevronsRight>
                    </Link>
                </li>
            </ul>
        </>
    )
};

export default Pagination;