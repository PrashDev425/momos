import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MomoForm = () => {
    const [form, setForm] = useState({
        name: "", description: "", price: "", tags: "", image: null
    });
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    const loadMomo = async () => {
        try {
            const res = await fetch(`/api/momos/${id}`);
            const data = await res.json();
            const momo = data.data;
            setForm({ ...momo, image: null });
            if (momo.imagePath) {
                setPreview(momo.imagePath);
            }
        } catch (err) {
            console.error("Failed to load momo:", err);
        }
    };

    useEffect(() => {
        if (id) loadMomo();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            const file = files[0];
            setForm({ ...form, image: file });
            setPreview(URL.createObjectURL(file));
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const toCamelCase = (str) => str.charAt(0).toLowerCase() + str.slice(1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData();
        for (let key in form) {
            if (form[key]) formData.append(key, form[key]);
        }

        const options = {
            method: id ? "PUT" : "POST",
            body: formData,
            credentials: 'include',
        };

        try {
            const url = id ? `/api/momos/${id}` : `/api/momos`;
            const res = await fetch(url, options);

            let result = {};
            try {
                result = await res.json();
            } catch (err) {
                console.error("Invalid JSON:", err);
            }

            if (res.ok && result.status) {
                navigate("/admin/momo");
            } else {
                if (result?.hasValidationErrors && result?.validationErrors) {
                    const fixedErrors = {};
                    for (const key in result.validationErrors) {
                        fixedErrors[toCamelCase(key)] = result.validationErrors[key];
                    }
                    setErrors(fixedErrors);
                } else {
                    alert(result.message || "Something went wrong");
                }
            }
        } catch (err) {
            console.error("Unexpected submit error:", err);
            alert("Network or server error");
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
                {id ? "Edit Momo" : "Create New Momo"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Momo name"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.name && errors.name.map((err, idx) => (
                        <p key={idx} className="text-sm text-red-500 mt-1">{err}</p>
                    ))}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                        rows={4}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.description && errors.description.map((err, idx) => (
                        <p key={idx} className="text-sm text-red-500 mt-1">{err}</p>
                    ))}
                </div>

                {/* Price and Tags */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Price</label>
                        <input
                            name="price"
                            value={form.price}
                            type="number"
                            onChange={handleChange}
                            placeholder="Rs."
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {errors.price && errors.price.map((err, idx) => (
                            <p key={idx} className="text-sm text-red-500 mt-1">{err}</p>
                        ))}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Tags</label>
                        <input
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            placeholder="e.g. spicy, steamed"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {errors.tags && errors.tags.map((err, idx) => (
                            <p key={idx} className="text-sm text-red-500 mt-1">{err}</p>
                        ))}
                    </div>
                </div>

                {/* Image */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Image</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        accept="image/*"
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-32 h-32 mt-3 object-cover rounded border"
                        />
                    )}
                    {errors.image && errors.image.map((err, idx) => (
                        <p key={idx} className="text-sm text-red-500 mt-1">{err}</p>
                    ))}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded shadow"
                >
                    {id ? "Update Momo" : "Create Momo"}
                </button>
            </form>
        </div>
    );
}

export default MomoForm;