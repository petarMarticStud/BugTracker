import React, { useState, useEffect } from 'react';

// Für Tailwind CSS, das in index.html geladen wird.
function BugPage() {
    const [bugs, setBugs] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBugs = async () => {
            try {
                const res = await fetch('/api/bugs');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setBugs(data);
            } catch (err) {
                setError("Failed to load bugs. Make sure your Spring Boot backend is running and accessible at /api/bugs.");
                console.error("Error fetching bugs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBugs();
    }, []);

    const addBug = async () => {
        if (!title.trim() || !description.trim()) {
            alert('Title and Description cannot be empty!');
            return;
        }

        try {
            const response = await fetch('/api/bugs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, status: 'OPEN' }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setTitle('');
            setDescription('');
            setError(null);
            const res = await fetch('/api/bugs');
            const data = await res.json();
            setBugs(data);

        } catch (err) {
            setError("Failed to add bug. Please check your backend connection and input.");
            console.error("Error adding bug:", err);
        }
    };

    const deleteBug = async (id) => {
        try {
            const response = await fetch(`/api/bugs/${id}`, { method: 'DELETE' });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setError(null);
            const res = await fetch('/api/bugs');
            const data = await res.json();
            setBugs(data);

        } catch (err) {
            setError(`Failed to delete bug with ID: ${id}.`);
            console.error("Error deleting bug:", err);
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading bugs...</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Bug Tracker</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add New Bug</h2>
                <div className="flex flex-col space-y-4">
                    <input
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Bug Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        className="p-3 border border-gray-300 rounded-md h-24 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Bug Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={addBug}
                    >
                        Add Bug
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Current Bugs</h2>
                {bugs.length === 0 ? (
                    <p className="text-gray-600">No bugs found. Add one above!</p>
                ) : (
                    <ul className="space-y-4">
                        {bugs.map(bug => (
                            <li
                                key={bug.id}
                                className="flex justify-between items-center bg-gray-50 p-4 rounded-md border border-gray-200 shadow-sm"
                            >
                                <div className="flex-grow">
                                    <h3 className="text-lg font-medium text-gray-900">{bug.title}</h3>
                                    <p className="text-gray-700">{bug.description}</p>
                                    <span className={`text-sm font-semibold ${bug.status === 'OPEN' ? 'text-red-600' : 'text-green-600'}`}>
                                        Status: {bug.status}
                                    </span>
                                </div>
                                <button
                                    className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => deleteBug(bug.id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default BugPage;
