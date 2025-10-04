import { useSelector } from "react-redux";

const Categories = () => {

    const { categories } = useSelector((store) => store.categories)

    return (
        <div className="bg-white shadow-md p-6 my-2 mx-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                {categories.map((cat, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col items-center text-center p-3 rounded-xl border hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <img
                            src={cat?.image?.url}
                            alt={cat.name}
                            className="w-20 h-20 object-contain mb-2"
                        />
                        <p className="text-sm font-medium text-gray-700">{cat.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default Categories