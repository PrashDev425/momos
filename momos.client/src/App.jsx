import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [momo, setMomo] = useState([]);

    useEffect(() => {
        populateMomoData();
    }, []);

    const contents = momo.length === 0
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Image</th>
                    <th>Tags</th>
                </tr>
            </thead>
            <tbody>
                {momo.map(x =>
                    <tr key={x.id}>
                        <td>{x.id}</td>
                        <td>{x.name}</td>
                        <td>{x.description}</td>
                        <td>{x.price}</td>
                        <td><img width="100" height="100" src={x.imagePath} alt={x.name} /></td>
                        <td>{x.tags}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tableLabel">Momo List</h1>
            <p>This component demonstrates fetching momo data from the server.</p>
            {contents}
        </div>
    );

    async function populateMomoData() {
        try {
            const response = await fetch('api/momos');
            if (response.ok) {
                const data = await response.json();
                console.table(data);
                setMomo(data);
            } else {
                console.error("Failed to fetch:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
}

export default App;
