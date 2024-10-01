import React, { useState } from "react";
import Navbar from "./Navbar";

export default function Lifecycle() {

    const [forklifts, setForklifts] = useState([]);
    const [sortOrder, setSortOrder] = useState("ascending");

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.error("no file selected");
            return;}

        const formData = new FormData();
        formData.append("file", file);
        //console.log("formdata:", formData);
        try {
            const response = await fetch('http://localhost:5093/api/forklifts',{
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setForklifts(data);
        } catch (error) {
            console.error('Error fetching forklifts list:', error);
        }
    };
    
    const filteredForklifts = forklifts.sort((a,b) => {
        if (sortOrder === "ascending") {
            return a.age - b.age;
        } else {
            return b.age - a.age; 
        }
    });


    const handleSortChange = (order) => {
        setSortOrder(order);
    };
    return(
        <>
            <Navbar/>
            <div className="lifecycle">
                <h1>Forklift Manager</h1>
                <span className="supportedfiles">Files Supported JSON, CSV</span>
                <div>
                    <label className="filelabel" onClick={() => document.getElementById('file-input').click()}>Upload</label>
                    <input id="file-input" type="file" accept=".json,.csv" onChange={handleFileUpload} style={{ display: 'none' }}/>
                </div>

                <div className="selection">
                    <label>
                        Filter:
                        <select onChange={(e) => handleSortChange(e.target.value)}>
                            <option value="recent">Recent Models</option>
                            <option value="outdated">Outdated Models</option>
                        </select>
                    </label>
                </div>

                {forklifts.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Model Number</th>
                            <th>Manufacturing Date</th>
                            <th>Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredForklifts.map((forklift, index) => (
                            <tr key={index}>
                                <td>{forklift.name}</td>
                                <td>{forklift.modelNumber}</td>
                                <td>{forklift.manufacturingDate}</td>
                                <td>{forklift.age}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
                

            </div>
        </>
    );
} 