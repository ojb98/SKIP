import { IdCard, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

const activeClass = 'inline-flex items-center gap-3 p-4 text-black border-b-2 border-black rounded-t-lg';
const inactiveClass = 'inline-flex items-center gap-3 p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300';

const IdPasswordFindTab = ({ active }) => {
    return (
        <>
            <div className="w-90 text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                <ul className="flex flex-wrap justify-between items-end gap-7 -mb-px">
                    <li>
                        <Link to="/id/find" className={active == 'id' ? activeClass : inactiveClass} aria-current={active == 'id' ? 'page' : 'false'}>
                            <IdCard></IdCard>
                            <span>아이디 찾기</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/password/reset/id" className={active == 'pwd' ? activeClass : inactiveClass} aria-current={active == 'pwd' ? 'page' : 'false'}>
                            <KeyRound></KeyRound>
                            비밀번호 재설정
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
};

export default IdPasswordFindTab;