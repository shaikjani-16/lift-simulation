// class LiftSystem {
//     constructor(floors, lifts) {
//         this.floors = floors;
//         this.lifts = Array(lifts).fill().map(() => ({
//             currentFloor: 0,
//             targetFloors: [],
//             isMoving: false,
//             direction: null
//         }));
//     }

//     requestLift(floorNumber, direction) {
//         const availableLift = this.findNearestAvailableLift(floorNumber, direction);
//         if (availableLift !== null) {
//             const lift = this.lifts[availableLift];
//             if (!lift.targetFloors.includes(floorNumber)) {
//                 lift.targetFloors.push(floorNumber);
//                 lift.targetFloors.sort((a, b) => a - b); // Ensure target floors are sorted
//             }
//             if (!lift.isMoving) {
//                 this.processLiftMovement(availableLift);
//             }
//         }
//     }

//     findNearestAvailableLift(floorNumber, direction) {
//         let nearestLift = null;
//         let minDistance = Infinity;

//         for (let i = 0; i < this.lifts.length; i++) {
//             const lift = this.lifts[i];
//             if (!lift.isMoving) {
//                 const distance = Math.abs(lift.currentFloor - floorNumber);
//                 if (distance < minDistance) {
//                     minDistance = distance;
//                     nearestLift = i;
//                 }
//             }
//         }

//         return nearestLift;
//     }

//     async processLiftMovement(liftIndex) {
//         const lift = this.lifts[liftIndex];
//         if (lift.targetFloors.length === 0) return;

//         lift.isMoving = true;

//         while (lift.targetFloors.length > 0) {
//             const targetFloor = lift.targetFloors.shift();
//             lift.direction = targetFloor > lift.currentFloor ? 'up' : 'down';

//             // Move lift gradually
//             await this.animateLiftMovement(liftIndex, lift.currentFloor, targetFloor);
//             await new Promise(res=>setTimeout(res,1800))

//             // After lift has reached the target floor, open the doors
//             await this.animateDoors(liftIndex, true);

//             // Wait for a moment
//             await new Promise(resolve => setTimeout(resolve, 1000));

//             // Close doors
//             await this.animateDoors(liftIndex, false);

//             lift.currentFloor = targetFloor;
//         }

//         lift.isMoving = false;
//         lift.direction = null;
//     }

//     animateLiftMovement(liftIndex, startFloor, endFloor) {
//         return new Promise(resolve => {
//             const liftElement = document.querySelector(`.lift:nth-child(${liftIndex + 1})`);
//             const startPosition = startFloor * 70;
//             const endPosition = endFloor * 70;
//             const distance = Math.abs(endPosition - startPosition);
//             const duration = distance / 35 * 2000; // 2 seconds per floor

//             const startTime = performance.now();
//             const animate = (currentTime) => {
//                 const elapsedTime = currentTime - startTime;
//                 if (elapsedTime < duration) {
//                     const progress = elapsedTime / duration;
//                     const currentPosition = startPosition + (endPosition - startPosition) * progress;
//                     liftElement.style.bottom = `${currentPosition}px`;
//                     requestAnimationFrame(animate);
//                 } else {
//                     liftElement.style.bottom = `${endPosition}px`;
//                     resolve();
//                 }
//             };

//             requestAnimationFrame(animate);
//         });
//     }

//     animateDoors(liftIndex, isOpening) {
//         return new Promise(resolve => {
//             const liftElement = document.querySelector(`.lift:nth-child(${liftIndex + 1})`);
//             const leftDoor = liftElement.querySelector('.lift-door.left');
//             const rightDoor = liftElement.querySelector('.lift-door.right');
//             const targetScale = isOpening ? 0 : 1;

//             leftDoor.style.transition = 'transform 2.5s ease';
//             rightDoor.style.transition = 'transform 2.5s ease';
//             leftDoor.style.transform = `scaleX(${targetScale})`;
//             rightDoor.style.transform = `scaleX(${targetScale})`;

//             setTimeout(resolve, 2500); // Wait for the door animation to complete
//         });
//     }
// }

// let liftSystem;

// function generateSimulation() {
//     const floorsInput = document.getElementById('floors');
//     const liftsInput = document.getElementById('lifts');
//     const simulationContainer = document.getElementById('simulation-container');

//     const floors = parseInt(floorsInput.value);
//     const lifts = parseInt(liftsInput.value);

//     liftSystem = new LiftSystem(floors, lifts);

//     simulationContainer.innerHTML = '';

//     // Create building and floors
//     const building = document.createElement('div');
//     building.className = 'building';

//     for (let i = 0; i < floors; i++) {
//         const floor = document.createElement('div');
//         floor.className = 'floor';

//         const floorNumber = document.createElement('div');
//         floorNumber.className = 'floor-number';
//         floorNumber.textContent = i;

//         const floorButtons = document.createElement('div');
//         floorButtons.className = 'floor-buttons';
//         if (i !== floors - 1) {
//             const upButton = document.createElement('button');
//             upButton.className = 'floor-button up';
//             upButton.textContent = '▲';
//             upButton.addEventListener('click', () => liftSystem.requestLift(i, 'up'));
//             floorButtons.appendChild(upButton);
//         }
//         if (i !== 0) {
//             const downButton = document.createElement('button');
//             downButton.className = 'floor-button down';
//             downButton.textContent = '▼';
//             downButton.addEventListener('click', () => liftSystem.requestLift(i, 'down'));
//             floorButtons.appendChild(downButton);
//         }

//         floor.appendChild(floorNumber);
//         floor.appendChild(floorButtons);
//         building.appendChild(floor);
//     }

//     simulationContainer.appendChild(building);

//     // Create lifts
//     const liftsContainer = document.createElement('div');
//     liftsContainer.className = 'lifts-container';

//     for (let i = 0; i < lifts; i++) {
//         const lift = document.createElement('div');
//         lift.className = 'lift';
        
//         const leftDoor = document.createElement('div');
//         leftDoor.className = 'lift-door left';
        
//         const rightDoor = document.createElement('div');
//         rightDoor.className = 'lift-door right';
        
//         lift.appendChild(leftDoor);
//         lift.appendChild(rightDoor);
//         liftsContainer.appendChild(lift);
//     }

//     simulationContainer.appendChild(liftsContainer);
// }

// document.getElementById('generate').addEventListener('click', generateSimulation);
class LiftSystem {
    constructor(floors, lifts) {
        this.floors = floors;
        this.lifts = Array(lifts).fill().map(() => ({
            currentFloor: 0,
            targetFloors: [],
            isMoving: false,
            direction: null,
            button: null // Track the button associated with this lift request
        }));
    }

    requestLift(floorNumber, direction, button) {
        // Find the nearest available lift
        const availableLiftIndex = this.findNearestAvailableLift(floorNumber, direction);
        if (availableLiftIndex !== null) {
            const lift = this.lifts[availableLiftIndex];
            
            // Add the floor to the lift's target floors if not already present
            if (!lift.targetFloors.includes(floorNumber)) {
                lift.targetFloors.push(floorNumber);
                lift.targetFloors.sort((a, b) => a - b); // Ensure target floors are sorted
            }
            
            // Track the button and disable it
            lift.button = button;
            button.disabled = true;
            
            // Process the lift movement if it's not already moving
            if (!lift.isMoving) {
                this.processLiftMovement(availableLiftIndex);
            }
        }
    }

    findNearestAvailableLift(floorNumber, direction) {
        let nearestLift = null;
        let minDistance = Infinity;

        for (let i = 0; i < this.lifts.length; i++) {
            const lift = this.lifts[i];
            if (!lift.isMoving) {
                const distance = Math.abs(lift.currentFloor - floorNumber);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestLift = i;
                }
            }
        }

        return nearestLift;
    }

    async processLiftMovement(liftIndex) {
        const lift = this.lifts[liftIndex];
        if (lift.targetFloors.length === 0) return;

        lift.isMoving = true;

        while (lift.targetFloors.length > 0) {
            const targetFloor = lift.targetFloors.shift();
            lift.direction = targetFloor > lift.currentFloor ? 'up' : 'down';

            // Move lift gradually
            await this.animateLiftMovement(liftIndex, lift.currentFloor, targetFloor);
            await new Promise(res => setTimeout(res, 1800));

            // After lift has reached the target floor, open the doors
            await this.animateDoors(liftIndex, true);

            // Wait for a moment
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Close doors
            await this.animateDoors(liftIndex, false);

            lift.currentFloor = targetFloor;
        }

        lift.isMoving = false;
        lift.direction = null;

        // Re-enable the button
        if (lift.button) {
            lift.button.disabled = false;
            lift.button = null; // Clear the button reference
        }
    }

    animateLiftMovement(liftIndex, startFloor, endFloor) {
        return new Promise(resolve => {
            const liftElement = document.querySelector(`.lift:nth-child(${liftIndex + 1})`);
            const startPosition = startFloor * 70;
            const endPosition = endFloor * 70;
            const distance = Math.abs(endPosition - startPosition);
            const duration = distance / 35 * 2000; // 2 seconds per floor

            const startTime = performance.now();
            const animate = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                if (elapsedTime < duration) {
                    const progress = elapsedTime / duration;
                    const currentPosition = startPosition + (endPosition - startPosition) * progress;
                    liftElement.style.bottom = `${currentPosition}px`;
                    requestAnimationFrame(animate);
                } else {
                    liftElement.style.bottom = `${endPosition}px`;
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    animateDoors(liftIndex, isOpening) {
        return new Promise(resolve => {
            const liftElement = document.querySelector(`.lift:nth-child(${liftIndex + 1})`);
            const leftDoor = liftElement.querySelector('.lift-door.left');
            const rightDoor = liftElement.querySelector('.lift-door.right');
            const targetScale = isOpening ? 0 : 1;

            leftDoor.style.transition = 'transform 2.5s ease';
            rightDoor.style.transition = 'transform 2.5s ease';
            leftDoor.style.transform = `scaleX(${targetScale})`;
            rightDoor.style.transform = `scaleX(${targetScale})`;

            setTimeout(resolve, 2500); // Wait for the door animation to complete
        });
    }
}

let liftSystem;

function generateSimulation() {
    const floorsInput = document.getElementById('floors');
    const liftsInput = document.getElementById('lifts');
    const simulationContainer = document.getElementById('simulation-container');

    const floors = parseInt(floorsInput.value);
    const lifts = parseInt(liftsInput.value);

    liftSystem = new LiftSystem(floors, lifts);

    simulationContainer.innerHTML = '';

    // Create building and floors
    const building = document.createElement('div');
    building.className = 'building';

    for (let i = 0; i < floors; i++) {
        const floor = document.createElement('div');
        floor.className = 'floor';

        const floorNumber = document.createElement('div');
        floorNumber.className = 'floor-number';
        floorNumber.textContent = i;

        const floorButtons = document.createElement('div');
        floorButtons.className = 'floor-buttons';
        if (i !== floors - 1) {
            const upButton = document.createElement('button');
            upButton.className = 'floor-button up';
            upButton.textContent = '▲';
            upButton.addEventListener('click', () => {
                liftSystem.requestLift(i, 'up', upButton);
            });
            floorButtons.appendChild(upButton);
        }
        if (i !== 0) {
            const downButton = document.createElement('button');
            downButton.className = 'floor-button down';
            downButton.textContent = '▼';
            downButton.addEventListener('click', () => {
                liftSystem.requestLift(i, 'down', downButton);
            });
            floorButtons.appendChild(downButton);
        }

        floor.appendChild(floorNumber);
        floor.appendChild(floorButtons);
        building.appendChild(floor);
    }

    simulationContainer.appendChild(building);

    // Create lifts
    const liftsContainer = document.createElement('div');
    liftsContainer.className = 'lifts-container';

    for (let i = 0; i < lifts; i++) {
        const lift = document.createElement('div');
        lift.className = 'lift';
        
        const leftDoor = document.createElement('div');
        leftDoor.className = 'lift-door left';
        
        const rightDoor = document.createElement('div');
        rightDoor.className = 'lift-door right';
        
        lift.appendChild(leftDoor);
        lift.appendChild(rightDoor);
        liftsContainer.appendChild(lift);
    }

    simulationContainer.appendChild(liftsContainer);
}

document.getElementById('generate').addEventListener('click', generateSimulation);
