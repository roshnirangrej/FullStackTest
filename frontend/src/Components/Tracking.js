import React, { useState, useEffect, useRef } from 'react';
import Navbar from "./Navbar";
//import North from '../images/NorthF.jpg'; 
//import South from '../images/South.jpg';
import arrow from '../images/arrow.webp';
import East from '../images/East.jpg';
import obstacleImage from '../images/obstacle.jpg';


//const forkliftImg = [North,South,West,East];

export default function Track() {
    const canvasRef = useRef(null);
    const [commands, setCommands] = useState('');
    const [commandLog, setCommandLog] = useState(''); 
    const [currentObstacle, setCurrentObstacle] = useState({ x: '', y: '' });
    const [obstacles, setObstacles] = useState([]);
    const [forklift, setForklift] = useState({
        x: 0, 
        y: 0, 
        direction: 0, 
    });

    const canvasWidth =800;
    const canvasHeight =350;
    const gridSize = 20;

    useEffect(() => {

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const obstacleImg = new Image();
        obstacleImg.src = obstacleImage;

        const forkliftImg = new Image();
        forkliftImg.src =  East;

        const arrowImg = new Image();
        arrowImg.src = arrow;
        


        /*const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;


        const drawForklift = () => {
            const forkliftSize = 80;
            const forkliftX = canvasWidth / 2 + forklift.x * 20; 
            const forkliftY = canvasHeight / 2 - forklift.y * 20;
            
            //context.drawImage(forkliftImg[forklift.direction / 90], forkliftX - forkliftSize / 2, forkliftY - forkliftSize / 2, forkliftSize, forkliftSize);
           context.save(); 
            context.translate(forkliftX, forkliftY);
            
            switch (forklift.direction) {
                case 0: 
                    break;
                case 90: 
                    context.rotate(90 * (Math.PI / 180)); 
                    break;
                case 180: 
                    context.rotate(180 * (Math.PI / 180)); 
                    break;
                case 270:
                    context.rotate(270 * (Math.PI / 180)); 
                    break;
                default:
                    break;
            }

            context.drawImage(forkliftImg, -forkliftSize / 2, -forkliftSize / 2, forkliftSize, forkliftSize);

            context.restore(); 
        };

        const drawObstacles = () => {
            const obstacleSize = 30;
            obstacles.forEach((obstacle) => {
                const obstacleX = canvasWidth / 2 + parseInt(obstacle.x, 10) * 20; 
                const obstacleY = canvasHeight / 2 - parseInt(obstacle.y, 10) * 20;
                context.drawImage(obstacleImg, obstacleX - obstacleSize / 2, obstacleY - obstacleSize / 2, obstacleSize, obstacleSize);
            });
        };*/
        const drawForklift = () => {
            const forkliftSize = gridSize * 3; // Adjust forklift size based on grid
            const forkliftX =
              Math.max(
                gridSize, // Ensure forklift stays within canvas bounds
                Math.min(canvasWidth - gridSize - forkliftSize, forklift.x * gridSize)
              ) +
              gridSize / 2; // Center forklift within grid cell
            const forkliftY =
              Math.max(
                gridSize,
                Math.min(canvasHeight - gridSize - forkliftSize, canvasHeight - forklift.y * gridSize)
              ) -
              gridSize / 2; // Center forklift within grid cell
      
            context.save();
            context.translate(forkliftX, forkliftY);
            context.rotate(forklift.direction * (Math.PI / 90));
            context.drawImage(forkliftImg, -forkliftSize / 2, -forkliftSize / 2, forkliftSize, forkliftSize);
            context.restore();
          };
      
          const drawObstacles = () => {
            const obstacleSize = gridSize * 1.5; 
            obstacles.forEach((obstacle) => {
              const obstacleX =
                Math.max(gridSize, Math.min(canvasWidth - obstacleSize, obstacle.x * gridSize)) +
                gridSize / 2; 
              const obstacleY =
                Math.max(gridSize, Math.min(canvasHeight - obstacleSize, canvasHeight - obstacle.y * gridSize)) -
                gridSize / 2; 
              context.drawImage(obstacleImg, obstacleX - obstacleSize / 2, obstacleY - obstacleSize / 2, obstacleSize, obstacleSize);
            });
          };
      
          const clearCanvas = () => {
            context.clearRect(0, 0, canvasWidth, canvasHeight);
          };
        
        forkliftImg.onload = () => {
            drawForklift();
            drawObstacles();
          
        };

        drawForklift();
    

    }, [forklift,obstacles,commandLog]);

    const handleAddObstacle = () => {
        setObstacles([...obstacles, { x: Number(currentObstacle.x), y: Number(currentObstacle.y) }]);
        setCurrentObstacle({ x: '', y: '' });
    }

    const handleCommandSubmit = () => {
        setCommandLog([]); 
    
        const Data = {
            commands: commands.toUpperCase(),  
            obstacles: obstacles 
        };

        fetch('http://localhost:5093/api/Forklifts/canvas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Data),
        })
        .then(response => response.json())
        .then(data => {
            //console.log("Response from backend:", data); 
            data.positionHistory.forEach((position, index) => {
                setTimeout(() => {
                    setForklift({
                        x: position.x,
                        y: position.y,
                        direction: position.direction
                    });
                    setCommandLog(data.log[index]); 
                }, index * 5000); 
            });
            setTimeout(() => {
                if (data.log.length) {
                    setCommandLog(data.log[data.log.length - 1]); 
                }
            }, data.positionHistory.length * 5000);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        setCommands('');
    };

    const formatObstacles = () => {
        return obstacles.map(obstacle => `(${obstacle.x}, ${obstacle.y})`).join(', ');
    }
    return(
        <>
            <Navbar/>
            <div className='movesConatiner'>
            <div className='top-bar'>
            <h1>Forklift Tracking System</h1>
                <div className="obstacle-inputs">
                    <h3>Enter Obstacles (x, y coordinates):</h3>
                    <input
                            type="number"
                            value={currentObstacle.x}
                            onChange={(e) => setCurrentObstacle({ ...currentObstacle, x: e.target.value })}
                            placeholder="X"
                            className="xcordinate"
                    />
                    <input
                            type="number"
                            value={currentObstacle.y}
                            onChange={(e) => setCurrentObstacle({ ...currentObstacle, y: e.target.value })}
                            placeholder="Y"
                            className="ycordinate"
                    />
                    <button onClick={handleAddObstacle} className='submit-btn'>Add Obstacle</button>
                    {obstacles.length>0 && (
                    <div className="obstacles">
                        <p>Obstacles: [{formatObstacles()}]</p>
                    </div>
                )}
                </div>

                <div  className='commandInput'>
                    <input
                        type="text"
                        value={commands}
                        onChange={(e) => setCommands(e.target.value)}
                        className='command-input'
                        placeholder="Enter commands (e.g., F10R90L90B5)"
                       
                    />

                    <button onClick={handleCommandSubmit} className='submit-btn'>Submit</button>
                </div>
                </div>
            
                <div className='canvasContainer'>
                   <canvas
                        ref={canvasRef}
                        className='canvas' />
                        {commandLog && (
                        <div className="logMessageOverlay">
                            <p>{commandLog}</p> 
                        </div>
                    )}
                        
                </div>
            </div>
        
        </>
    );
}  