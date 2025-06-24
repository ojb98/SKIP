import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { fetchItemCategories, fetchSearchResult } from "../api/rentListApi";
import SearchBar from "../components/SearchBar";
import { AlertCircle, Briefcase, Check, LoaderCircle, MapPin, Phone } from "lucide-react";
import { radio } from "../components/buttons";

const host = __APP_BASE__;

const SearchResultPage = () => {
    const [searchParams] = useSearchParams();

    const keywordParam = searchParams.get('keyword');
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const categoriesParam = searchParams.getAll('categories');
    const sortParam = searchParams.get('sort');

    const [keyword, setKeyword] = useState(keywordParam);
    const [from, setFrom] = useState(fromParam ?? new Date(fromParam));
    const [to, setTo] = useState(toParam ?? new Date(toParam));
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sort, setSort] = useState(sortParam);
    const [searchResult, setSearchResult] = useState([]);
    const [nextPage, setNextPage] = useState();
    const [hasNext, setHasNext] = useState();
    const [loading, setLoading] = useState(false);

    const location = useLocation();

    const navigate = useNavigate();

    useEffect(() => {
        fetchSearchResult({
            keyword: keywordParam,
            from: fromParam,
            to: toParam,
            categories: categoriesParam,
            sort: sortParam
        }).then(res => handleInit(res));

        fetchItemCategories().then(res => {
            if (res.success) {
                setCategories(res.data);
            }
        });
    }, [location.search]);

    useEffect(() => {
        setSelectedCategories(categories.filter(c => categoriesParam.includes(c.value)));
    }, [categories]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= documentHeight - 100) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [nextPage, loading]);

    useEffect(() => {
        if (searchResult != null) {
            const params = new URLSearchParams();
            params.append('keyword', keyword);
            params.append('from', from ? from.toISOString().split('T')[0] : '');
            params.append('to', to ? to.toISOString().split('T')[0] : '');
            params.append('sort', sort);
            selectedCategories.forEach(c => params.append('categories', c.value));

            navigate(`/rent/search?${params.toString()}`);
        }
    }, [sort, searchResult]);


    const handleInit = res => {
        if (res.success) {
            setSearchResult(res.data.result);
            setNextPage(res.data.page + 1);
            setHasNext(res.data.hasNext);
            console.log(res.data);
        }
    };

    const handleResult = res => {
        setLoading(false);
        if (res.success) {
            setSearchResult([...searchResult, ...res.data.result]);
            setNextPage(res.data.page + 1);
            setHasNext(res.data.hasNext);
            console.log(res.data);
        }
    };

    const loadMore = () => {
        if (loading || !hasNext) return;

        setLoading(true);

        fetchSearchResult({
            keyword: keywordParam,
            from: fromParam,
            to: toParam,
            categories: categoriesParam,
            sort: sortParam,
            page: nextPage
        }).then(res => handleResult(res));
    };

    return (
        <>
            <div className="w-[1150px] py-10 space-y-10 font-[NanumSquare]">
                <SearchBar keywordState={[keyword, setKeyword]} fromState={[from, setFrom]} toState={[to, setTo]} selectedCategoriesState={[selectedCategories, setSelectedCategories]}></SearchBar>

                <div className="flex">
                    <label htmlFor="default" className={radio({ color: "secondary-text", className: 'w-20 h-10' })}>
                        <p className="flex items-center gap-1">
                            <span>기본순</span>
                            {
                                sort == 'DEFAULT'
                                &&
                                <Check size={12}></Check>
                            }
                        </p>

                        <input
                            type="radio"
                            id="default"
                            name="sort"
                            value="DEFAULT"
                            defaultChecked
                            onClick={e => setSort(e.target.value)}
                            className="sr-only"
                        ></input>
                    </label>

                    <label htmlFor="popular" className={radio({ color: "secondary-text", className: 'w-24 h-10' })}>
                        <p className="flex items-center gap-1">
                            <span>인기순</span>
                            {
                                sort == 'POPULAR'
                                &&
                                <Check size={12}></Check>
                            }
                        </p>

                        <input
                            type="radio"
                            id="popular"
                            name="sort"
                            value="POPULAR"
                            onClick={e => setSort(e.target.value)}
                            className="sr-only"
                        ></input>
                    </label>

                    <label htmlFor="rating" className={radio({ color: "secondary-text", className: 'w-24 h-10' })}>
                        <p className="flex items-center gap-1">
                            <span>평점순</span>
                            {
                                sort == 'RATING'
                                &&
                                <Check size={12}></Check>
                            }
                        </p>

                        <input
                            type="radio"
                            id="rating"
                            name="sort"
                            value="RATING"
                            onClick={e => setSort(e.target.value)}
                            className="sr-only"
                        ></input>
                    </label>
                </div>

                <ul className="space-y-5">
                    {
                        searchResult.map(r => (
                            <li key={r.rentId} className="w-full h-fit flex gap-10 p-5 border border-gray-200 rounded-md shadow-sm bg-white">
                                <div className="w-fit h-full">
                                    <img src={`${host}${r.thumbnail}`} className="w-30 h-30 rounded-xl"></img>
                                </div>
                                
                                <div className="w-full space-y-1">
                                    <h1 className="text-xl font-semibold"><Link to={`/rent/detail/${r.rentId}`}>{r.name}</Link></h1>

                                    <p>{r.description}</p>

                                    <div className="mt-5 space-y-3 text-sm text-gray-500">
                                        <p className="flex items-center gap-2"><Phone size={16} className="inline"></Phone> {r.phone}</p>

                                        <p className="flex items-center gap-2"><Briefcase size={16} className="inline"></Briefcase> {r.bizRegNumber}</p>
                                    </div>
                                </div>

                                <div className="w-full flex flex-col items-end gap-5">
                                    <p className="flex items-center gap-2"><MapPin size={16} className="inline"></MapPin>{r.streetAddress}</p>

                                    <p className="flex items-center gap-2"><MapPin size={16} className="inline"></MapPin>{r.basicAddress}</p>
                                </div>
                            </li>
                        ))
                    }
                </ul>

                {
                    loading
                    &&
                    <div className="flex justify-center items-center gap-1 p-10 text-lg font-semibold">
                        <LoaderCircle size={40} className="animate-spin"></LoaderCircle>
                    </div>
                }

                {
                    !hasNext
                    &&
                    <div className="flex justify-center items-center gap-1 p-10 text-lg font-semibold">
                        <AlertCircle size={20} className="inline"></AlertCircle><p>검색된 결과가 없습니다.</p>
                    </div>
                }
            </div>
        </>
    )
};

export default SearchResultPage;