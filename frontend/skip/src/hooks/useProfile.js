const useProfile = () => {
    return {
        userId: 1,
        username: 'admin',
        email: 'admin',
        social: 'NONE',
        roles: [
            'USER',
            'MANAGER',
            'ADMIN'
        ],
        image: null
    };
}

export default useProfile;