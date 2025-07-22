import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MomoDetail = () => {
    const { id } = useParams();
    const [momo, setMomo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMomo = async () => {
            try {
                const res = await fetch(`/api/momos/${id}`);
                if (!res.ok) throw new Error("Failed to fetch momo details");

                const data = await res.json();
                if (data.status) {
                    setMomo(data.data);
                } else {
                    throw new Error(data.message || "Momo not found");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMomo();
    }, [id]);

    if (loading) return <p className="text-center text-gray-600 mt-10">Loading momo details...</p>;
    if (error) return <p className="text-center text-red-600 mt-10">Error: {error}</p>;

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
                {momo.imagePath && (
                    <img
                        src={momo.imagePath}
                        alt={momo.name}
                        className="w-64 h-64 object-cover rounded-lg shadow-lg border"
                    />
                )}

                <div className="flex-1 space-y-3">
                    <h2 className="text-3xl font-bold text-gray-800">{momo.name}</h2>
                    <p className="text-gray-700">{momo.description}</p>
                    <p className="text-xl font-semibold text-orange-600">Rs. {momo.price}</p>
                </div>
            </div>

            <div className="pt-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                    {momo.tags?.split(',').map((tag, idx) => (
                        <span
                            key={idx}
                            className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                            {tag.trim()}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MomoDetail;