import { useEffect, useState } from 'react';

function Home() {
    const [momo, setMomo] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        populateMomoData();
    }, []);

    async function populateMomoData() {
        try {
            const response = await fetch('/api/momos');
            if (response.ok) {
                const data = await response.json();
                console.table(data);
                setMomo(data);
            } else {
                console.error("Failed to fetch:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Momo List</h1>
                <p className="mb-6 text-gray-600">
                    This component demonstrates fetching momo data from the server.
                </p>

                {loading ? (
                    <p className="text-gray-500">
                        <em>
                            Loading... Please refresh once the ASP.NET backend has started. See{' '}
                            <a
                                href="https://aka.ms/jspsintegrationreact"
                                className="text-blue-600 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                https://aka.ms/jspsintegrationreact
                            </a>
                            .
                        </em>
                    </p>
                ) : momo.length === 0 ? (
                    <p className="text-red-500">No momo data found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                            <thead>
                                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                    <th className="py-2 px-4 border-b">Id</th>
                                    <th className="py-2 px-4 border-b">Name</th>
                                    <th className="py-2 px-4 border-b">Description</th>
                                    <th className="py-2 px-4 border-b">Price</th>
                                    <th className="py-2 px-4 border-b">Image</th>
                                    <th className="py-2 px-4 border-b">Tags</th>
                                </tr>
                            </thead>
                            <tbody>
                                {momo.data.map((x) => (
                                    <tr key={x.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{x.id}</td>
                                        <td className="py-2 px-4 border-b">{x.name}</td>
                                        <td className="py-2 px-4 border-b">{x.description}</td>
                                        <td className="py-2 px-4 border-b">Rs. {x.price}</td>
                                        <td className="py-2 px-4 border-b">
                                            <img
                                                src={x.imagePath}
                                                alt={x.name}
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">{x.tags}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
