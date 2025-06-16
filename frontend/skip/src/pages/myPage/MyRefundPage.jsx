import { useEffect, useRef, useState } from "react";
import Pagination from "../../components/myPage/Pagination";
import RefundSearchFilter from "../../components/myPage/RefundSearchFilter";
import { searchRefunds } from "../../api/refundApi";

const MyRefundPage = () => {
    const from = useRef();
    const to = useRef();

    const [sort, setSort] = useState("LATEST");
    const [appliedConditions, setAppliedConditions] = useState({});
    const [refundsPage, setRefundsPage] = useState({
        content: []
    });

    useEffect(() => {
        searchHandler(0);
    }, [sort, appliedConditions]);


    const searchHandler = (page = 0) => {
        searchRefunds({
            ...appliedConditions,
            sort: sort,
            page: 0
        }).then(res => {
            if (res.success) {
                setRefundsPage(res.data);
            }
        });
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-5">환불 내역</h1>

            <span className="w-full my-3 flex items-center">
                <span className="h-px flex-1 bg-gray-300"></span>
            </span>

            <RefundSearchFilter condition={{ from, to }} sort={sort} setSort={setSort} setAppliedConditions={setAppliedConditions}></RefundSearchFilter>

            <ul className="space-y-10 my-20">
                {
                    refundsPage.content.length == 0
                    &&
                    <p className="text-lg text-gray-700">조회된 목록이 없습니다.</p>
                    ||
                    refundsPage.content.map(r => (
                        <li key={r.refundId}>

                        </li>
                    ))
                }
            </ul>

            <Pagination pageNumber={refundsPage.number} totalPages={refundsPage.totalPages} searchHandler={searchHandler}></Pagination>
        </>
    )
};

export default MyRefundPage;