import React, { useState, useEffect, useRef } from 'react';
import Navbar from "./Navbar";

export default function Moves() {
    const [commands, setCommands] = useState('');
    const [commandLog, setCommandLog] = useState([]); // Stores movement descriptions

    const resetForkliftState = () => ({
        x: 0, // Initial x position
        y: 0, // Initial y position
        direction: 0, // 0 = North, 90 = East, 180 = South, 270 = West
    });

    const handleCommandSubmit = () => {
        setCommandLog([]); // Clear the previous log
        const parsedCommands = parseCommands(commands);
        

        for (let i = 0; i < parsedCommands.length; i++) {
            const cmd = parsedCommands[i];
    
            // Check for valid actions and values
            if (!cmd.action || isNaN(cmd.value) || cmd.value <= 0) {
                console.error("Invalid command input detected. Please check your commands.");
                alert("Invalid command input detected. Please check your commands.");
                return; // Exit early if there are errors
            }
    
            // Check if the action is 'L' or 'R' and if the value is valid
            if ((cmd.action === 'L' || cmd.action === 'R') && ![0, 90, 180, 270].includes(cmd.value)) {
                console.error("Invalid degree value for rotation. Must be 0, 90, 180, or 270.");
                alert("Invalid degree value for rotation. Must be 0, 90, 180, or 270.");
                return; // Exit early if there are errors
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
        let forklift = resetForkliftState();
        const newCommandLog = [];

        commands.forEach(({ action, value }) => {

                    let movementDescription = '';

            switch (action) {
                case 'F':
                    if (forklift.direction === 0) {
                        forklift.y += value; // North
                    } else if (forklift.direction === 90) {
                        forklift.x += value; // East
                    } else if (forklift.direction === 180) {
                        forklift.y -= value; // West
                    } else if (forklift.direction === 270) {
                        forklift.x -= value; // South 
                    }
                    movementDescription =`Move Forward by ${value} metres.`;
                    break;
                case 'B':
                    if (forklift.direction === 0) {
                        forklift.y -= value; // North
                    } else if (forklift.direction === 90) {
                        forklift.x -= value; // East
                    } else if (forklift.direction === 180) {
                        forklift.y += value; // South
                    } else if (forklift.direction === 270) {
                        forklift.x += value; // West
                    }
                    movementDescription = `Move Backward by ${value} metres.`;
                    break;
                case 'L':
                    forklift.direction = (forklift.direction - value + 360) % 360;
                    movementDescription = `Turn Left by ${value} degrees.`;
                    break;
                case 'R':
                    forklift.direction = (forklift.direction + value) % 360;
                    movementDescription =`Turn Right by ${value} degrees.`;        
                    break;
                default:
                    break;
            }
            newCommandLog.push(movementDescription);


});


        // Final position and facing direction
        const finalDirectionLabel = getDirectionLabel(forklift.direction);
        newCommandLog.push(`Final position: (${forklift.x}, ${forklift.y})`);
        newCommandLog.push(`Facing: ${finalDirectionLabel}`);

        
        setCommandLog(newCommandLog);
    };

// Function to get the label for the direction based on degrees
const getDirectionLabel = (direction) => {
if (direction === 0) return "North";
if (direction === 90) return "East";
if (direction === 180) return "South";
if (direction === 270) return "West";
return "Unknown";
};

    return (
        <>
           {/* <Navbar /> */}
            <div className="movesConatiner">
                <h1>Forklift Movement</h1>
                <div>
                <input
                    type="text"
                    value={commands}
                    onChange={(e) => setCommands(e.target.value)}
                    placeholder="Enter commands (e.g., F10R90L90B5)"
                    className="command-input"
                />
                </div>
                <button onClick={handleCommandSubmit} className="submit-btn">Submit Commands</button>

                <div className="movement-area">
                     <div className="command-log">
                        <h3>Command Log:</h3>
                        <ul className="log-list">
                            {commandLog.map((log, index) => (
                                <li key={index}>{log}</li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </>
    );
}
