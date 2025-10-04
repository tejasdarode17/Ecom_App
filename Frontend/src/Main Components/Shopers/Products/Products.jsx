import React from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

const Products = () => {
    const { products } = useSelector((store) => store.product)
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search");
    return (
        <div className='bg-[#fff] w-full h-screen'>
            <div>
                <p>Showing Result for {searchQuery} </p>
            </div>


        </div>
    )
}

export default Products