import React, { useEffect, useState } from 'react';

export default function BugTracker()
{
    const [bugs, setBugs] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetch('/api/bugs')
            .then(res => res.json())
            .then(setBugs);
    }, []);

    const addBug = () => {
        fetch('/api/bugs', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title, description, status: 'OPEN' }),
        })
            .then(() => {
                setTitle('');
                setDescription('');
                return fetch('/api/bugs');
            })
            .then(res => res.json())
            .then(setBugs);
    };

    const deleteBug = (id) => {
        fetch(`/api/bugs/${id}`, { method: 'DELETE' })
            .then(() => fetch('/api/bugs'))
            .then(res => res.json())
            .then(setBugs);
    };

    return (
        <div>
            <h1>Bugtracker</h1>
            <input
                placeholder="Titel"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <input
                placeholder="Beschreibung"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <button onClick={addBug}>Add bug</button>

            <ul>
                {bugs.map(bug => (
                    <li key={bug.id}>
                        <strong>{bug.title}</strong>: {bug.description} [{bug.status}]
                        <button onClick={() => deleteBug(bug.id)}>Delete bug</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
