import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, setProfile } from "../slices/loginSlice";

const LogoutButton = ({text = '로그아웃', styleClass = ''}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    return (
        <>
            <Link 
                onClick={() => {
                    dispatch(logout())
                        .unwrap()
                        .then(res => {
                            dispatch(setProfile());
                            navigate('/');
                        });
                }}
                className={`${styleClass}`}
            >
                {text}
            </Link>
        </>
    )
}

export default LogoutButton;