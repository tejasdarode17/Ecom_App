import React from 'react'
import { useSelector } from 'react-redux';
const Home = () => {

    const { isAuthenticated, userData } = useSelector((store) => store.auth);
    console.log(isAuthenticated)

    return (
        <div>

            <h1>main</h1>
        </div>
    )
}

export default Home
