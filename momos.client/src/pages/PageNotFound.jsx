import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center space-y-6">
                <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
                <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
                <p className="text-gray-600">
                    Sorry, the page you are looking for does not exist.
                </p>

                <Link
                    to="/"
                    className="inline-block mt-4 px-6 py-2 bg-accent text-white font-medium rounded-lg shadow hover:bg-accent/90 transition"
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
}

export default PageNotFound;