import React, { useState, useEffect, useRef } from 'react';
import Navbar from "./Navbar";

export default function Obstacle() {
    const [commandLog, setCommandLog] = useState([]); 
    const [commands, setCommands] = useState([]); 
    const [obstacles, setObstacles] = useState([]);
    const [currentObstacle, setCurrentObstacle] = useState({ x: '', y: '' });
    const [forklift, setForklift] = useState({
        x: 0, 
        y: 0, 
        direction: 0, 
    });
    

    const handleAddObstacle = () => {
        setObstacles([...obstacles, currentObstacle]); 
        setCurrentObstacle({ x: '', y: '' });
    }

    const obstaclevalues = (field, value) => {
        setCurrentObstacle(prev => ({
            ...prev,
            [field]: value
        }));
    }

    const formatObstacles = () => {
        return obstacles.map(obstacle => `(${obstacle.x}, ${obstacle.y})`).join(', ');
    }



    const handleCommandSubmit = () => {
        setCommandLog([]); 
        const parsedCommands = parseCommands(commands);

       
    for (let i = 0; i < parsedCommands.length; i++) {
        const cmd = parsedCommands[i];

        if (!cmd.action || isNaN(cmd.value) || cmd.value <= 0) {
            console.error("Invalid command input detected. Please check your commands.");
            alert("Invalid command input detected. Please check your commands.");
            return; 
        }

        if ((cmd.action === 'L' || cmd.action === 'R') && ![0, 90, 180, 270].includes(cmd.value)) {
            console.error("Invalid degree value for rotation. Must be 0, 90, 180, or 270.");
            alert("Invalid degree value for rotation. Must be 0, 90, 180, or 270.");
            return; 
        }
    }
       
        executeCommands(parsedCommands);
        setCommands('');
    };

    
    const parseCommands = (cmds) => {
        const parsedCommands = [];
        let i = 0;
        cmds = cmds.toUpperCase(); 

        while (i < cmds.length) {
            const action = cmds[i];
            if ('FBLR'.includes(action)) {
                let valueStr = '';
                i++;

                while (i < cmds.length && !isNaN(cmds[i])) {
                    valueStr += cmds[i];
                    i++;
                }

                const value = parseInt(valueStr, 10);
                parsedCommands.push({ action, value });
            } else {
                i++;
            }
        }
        return parsedCommands;
    };

    const executeCommands = (commands) => {
        let tempX = 0;
        let tempY = 0;
        let tempDirection = 0;
        const newCommandLog = [];

        let obstacleEncountered = false;

        commands.forEach(({ action, value }) => {
                    let movementDescription = '';
                   

                    if (obstacleEncountered) return; 

                    let targetX = tempX;
                    let targetY = tempY;

            switch (action) {
                case 'F':
                    if (tempDirection === 0) {
                        targetY += value; // North
                    } else if (tempDirection === 90) {
                        targetX += value; // East
                    } else if (tempDirection === 180) {
                        targetY -= value; // SOUTH
                    } else if (tempDirection === 270) {
                        targetX -= value; // WEST 
                    }
                    movementDescription = `Move Forward by ${value} metres.`;
                    break;
                case 'B':
                    if (tempDirection === 0) {
                        targetY -= value; // North
                    } else if (tempDirection === 90) {
                        targetX -= value; // East
                    } else if (tempDirection === 180) {
                        targetY += value; // South
                    } else if (tempDirection === 270) {
                        targetX += value; // West
                    }
                    movementDescription =  `Move Backward by ${value} metres.`;
                    break;
                case 'L':
                    tempDirection = (tempDirection - value + 360) % 360;
                    console.log("tempDirection L: ", tempDirection);
                    movementDescription = `Turn Left by ${value} degrees.`;

                    newCommandLog.push(movementDescription);
                    return;

                case 'R':
                    tempDirection = (tempDirection + value) % 360;
                    movementDescription = `Turn Right by ${value} degrees.`;  
                    console.log("tempDirection R: ", tempDirection); 
                    
                    newCommandLog.push(movementDescription);
                    return;

                default:
                    return;
            }

            newCommandLog.push(movementDescription);

        if (action === 'F' || action === 'B') {
            if (checkForObstacle(targetX, targetY, obstacles)) {
                obstacleEncountered = true; 
                newCommandLog.push(`Error: Obstacle encountered at (${targetX}, ${targetY}).`);
                return; 
            }
        }

   
        if (!obstacleEncountered) {
            tempX = targetX;
            tempY = targetY;
      
        }

        });
        
                setForklift({ x: tempX, y: tempY, direction: tempDirection });
                setCommandLog(newCommandLog);
            };
          
const checkForObstacle = (targetX, targetY, obstacles) => {

    for (let i = 0; i < obstacles.length; i++) {
        console.log("targetx and targety: ", targetX,targetY);

        const obstacleX = Number(obstacles[i].x);
        const obstacleY = Number(obstacles[i].y);

        if (obstacleX === targetX && obstacleY === targetY) {
            console.log("obstacle.x and obstacle.y : " ,obstacleX,obstacleY);
            return true; 
        }
    }
    return false; 
};   
    return (
        <>
           <Navbar /> 
           <div className='movesConatiner'>
            <h1>Obstacle Detection</h1>

            <h3>Enter Obstacles (x, y coordinates):</h3>
                    <div lassName="xycordinates" >
                        <input
                            type="number"
                            value={currentObstacle.x}
                            onChange={(e) => obstaclevalues('x', e.target.value)}
                            placeholder="X"
                            className="xcordinate" 
                        />
                        <input
                            type="number"
                            value={currentObstacle.y}
                            onChange={(e) => obstaclevalues('y', e.target.value)}
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
                
            <div className="commandInput">
            <input
                type="text"
                value={commands}
                onChange={(e) => setCommands(e.target.value)}
                placeholder="Enter commands (e.g., F10R90L90B5)"
                className='command-input'
            />

            <button onClick={handleCommandSubmit} className='submit-btn'>Submit Commands</button>
            </div>

          

            <div className='movement-area'>
                <div className='command-log'>
                <h3>Movement Details:</h3>
                <ul className='log-list'>
                    {commandLog.map((log, index) => (
                        <li key={index}>{log}</li>
                     ))}
                </ul>
                </div>
            </div>
        </div>  

        </>
    )
}