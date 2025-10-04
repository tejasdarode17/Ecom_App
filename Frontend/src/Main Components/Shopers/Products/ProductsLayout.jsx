import React from 'react'
import ProductsFilter from './ProductsFilter'
import Products from './Products'

const ProductsLayout = () => {
    return (
        <div className="flex w-full h-full mt-2">

            <aside className="w-1/4 p-4 border-r border-gray-200 bg-white sticky top-0 h-screen overflow-y-auto">
                <ProductsFilter />
            </aside>

            <main className="flex-1 px-2">
                <Products />
            </main>
        </div>
    )
}

export default ProductsLayout
