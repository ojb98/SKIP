import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../api/userApi";
import { setProfile } from "../slices/loginSlice";

const useProfile = () => {
    const state = useSelector(state => state.loginSlice);
    const dispatch = useDispatch();

    if (state.loggedIn) {
        if (typeof state.userId === 'undefined') {
            // 프로필 받아오기
            dispatch(setProfile());
        }

        return {
            userId: state.userId,
            username: state.username,
            email: state.email,
            social: state.social,
            roles: state.roles,
            registeredAt: state.registeredAt,
            image: state.image
        }
    }

    return null;
}

export default useProfile;