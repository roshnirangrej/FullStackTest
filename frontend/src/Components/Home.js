import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faRobot, faRoute, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';


const features = [
    { 
        name: 'Forklift Lifecycle', 
        icon: <FontAwesomeIcon icon={faRecycle} size="3x" />, 
        description: 'Track and manage the lifecycle of forklifts, including maintenance scheduling and repairs.', 
        path: '/Lifecycle' 
    },
    { 
        name: 'Forklift Movements', 
        icon: <FontAwesomeIcon icon={faRobot} size="3x" />, 
        description: 'Monitor and control the forklift movements based on input commands for efficient operation.', 
        path: '/Moves' 
    },
    { 
        name: 'Track Forklift', 
        icon: <FontAwesomeIcon icon={faRoute} size="3x" />, 
        description: 'Real-time position tracking of forklifts within the warehouse to ensure route efficiency.', 
        path: '/Tracking' 
    },
    { 
        name: 'Obstacle Detector', 
        icon: <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />, 
        description: 'Detect and prevent collisions with obstacles during forklift navigation for enhanced safety.', 
        path: '/Obstacle' 
    }
];

export default function Home() {
    const navigate = useNavigate();
    
    return (
        <>
            <div className="home-container">
                <h1 className="home-title">Forklift Management System</h1>

                <div className="features-grid">
                    {features.map((tool) => (
                        <div className="feature-card" key={tool.name} onClick={() => navigate(tool.path)}>
                            <div className="feature-icon">{tool.icon}</div>
                            <h3 className="feature-title">{tool.name}</h3>
                            <p className="feature-description">{tool.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
