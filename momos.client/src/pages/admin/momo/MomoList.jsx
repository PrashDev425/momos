import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const MomoList = () => {
    const [momos, setMomos] = useState([]);
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reload, setReload] = useState(0);

    const fetchMomos = async (filterTags) => {
        setLoading(true);
        setError(null);
        try {
            const url = `/api/momos?tags=${encodeURIComponent(filterTags)}`;
            const res = await fetch(url, { credentials: "include" });

            if (!res.ok) {
                throw new Error(`Failed to fetch momos (status ${res.status})`);
            }

            const json = await res.json();
            setMomos(json.data || []);
        } catch (err) {
            console.error("Fetch momos error:", err);
            setError(err.message || "Failed to fetch momos");
            setMomos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this momo?")) return;

        try {
            const res = await fetch(`/api/momos/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to delete (status ${res.status})`);
            }

            setReload((r) => r + 1);
        } catch (err) {
            console.error("Delete failed:", err);
            alert(err.message || "Network error or server did not respond.");
        }
    };

    useEffect(() => {
        fetchMomos(tags);
    }, [tags, reload]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Search by tags (e.g. spicy, steamed)"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/momo/create"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2 rounded-lg shadow transition"
                    >
                        + Add Momo
                    </Link>
                    <LogoutButton />
                </div>
            </div>

            {loading && <p className="text-center text-gray-500 mt-6">Loading momos...</p>}
            {error && <p className="text-center text-red-600 mt-6">{error}</p>}
            {!loading && !error && momos.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No momos found. Try different tags.</p>
            )}

            {!loading && !error && momos.length > 0 && (
                <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-orange-50 text-sm text-gray-700 uppercase tracking-wide">
                                <th className="px-5 py-3 text-left">Image</th>
                                <th className="px-5 py-3 text-left">Name</th>
                                <th className="px-5 py-3 text-left">Description</th>
                                <th className="px-5 py-3 text-left">Price</th>
                                <th className="px-5 py-3 text-left">Tags</th>
                                <th className="px-5 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {momos.map((momo, idx) => (
                                <tr key={momo.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="px-5 py-4">
                                        {momo.imagePath ? (
                                            <img
                                                src={momo.imagePath}
                                                alt={momo.name}
                                                className="w-16 h-16 object-cover rounded border"
                                            />
                                        ) : (
                                            <span className="text-gray-400 italic">No image</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 font-medium text-gray-800">{momo.name}</td>
                                    <td className="px-5 py-4 text-sm text-gray-600">
                                        {momo.description}
                                    </td>
                                    <td className="px-5 py-4 text-orange-600 font-semibold">
                                        Rs. {momo.price}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {momo.tags?.split(",").map((tag, i) => (
                                                <span
                                                    key={`${tag.trim()}_${i}`}
                                                    className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs"
                                                >
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-3 text-sm">
                                            <Link
                                                to={`/admin/momo/detail/${momo.id}`}
                                                className="text-blue-600 hover:text-blue-800 transition"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                to={`/admin/momo/edit/${momo.id}`}
                                                className="text-green-600 hover:text-green-800 transition"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(momo.id)}
                                                className="text-red-600 hover:text-red-800 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default MomoList;
