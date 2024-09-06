class LiftSystem {
    constructor(floors, lifts) {
        this.floors = floors;
        this.lifts = Array(lifts).fill().map(() => ({
            currentFloor: 0,
            targetFloor: null,
            isMoving: false,
            direction: null
        }));
    }

    requestLift(floorNumber, direction) {
        const availableLift = this.findNearestAvailableLift(floorNumber, direction);
        if (availableLift !== null) {
            this.moveLift(availableLift, floorNumber);
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

    /*async moveLift(liftIndex, targetFloor) {
        const lift = this.lifts[liftIndex];
        lift.isMoving = true;
        lift.targetFloor = targetFloor;
        lift.direction = targetFloor > lift.currentFloor ? 'up' : 'down';

        const liftElement = document.querySelector(`.lift:nth-child(${liftIndex + 1})`);
        const leftDoor = liftElement.querySelector('.lift-door.left');
        const rightDoor = liftElement.querySelector('.lift-door.right');

        // Move lift
        const floorsToMove = Math.abs(targetFloor - lift.currentFloor);
        
        liftElement.style.bottom = `${targetFloor * 70}px`;
        await new Promise(resolve => setTimeout(resolve, floorsToMove * 2000));

        // Open doors
        leftDoor.style.transform = 'scaleX(0)';
        rightDoor.style.transform = 'scaleX(0)';
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Close doors
        leftDoor.style.transform = 'scaleX(1)';
        rightDoor.style.transform = 'scaleX(1)';
        await new Promise(resolve => setTimeout(resolve, 2500));

        lift.currentFloor = targetFloor;
        lift.isMoving = false;
        lift.direction = null;
    }*/
        
    
        // async moveLift(liftIndex, targetFloor) {
        //     const lift = this.lifts[liftIndex];
        //     lift.isMoving = true;
        //     lift.targetFloor = targetFloor;
        //     lift.direction = targetFloor > lift.currentFloor ? 'up' : 'down';
    
        //     const liftElement = document.querySelector(`.lift:nth-child(${liftIndex + 1})`);
        //     const leftDoor = liftElement.querySelector('.lift-door.left');
        //     const rightDoor = liftElement.querySelector('.lift-door.right');
    
        //     // Move lift gradually
        //     await this.animateLiftMovement(liftElement, lift.currentFloor, targetFloor);
    
        //     // Open doors
        //     await this.animateDoors(leftDoor, rightDoor, true);
    
        //     // Wait for a moment
        //     await new Promise(resolve => setTimeout(resolve, 1000));
    
        //     // Close doors
        //     await this.animateDoors(leftDoor, rightDoor, false);
    
        //     lift.currentFloor = targetFloor;
        //     lift.isMoving = false;
        //     lift.direction = null;
        // }
    
        // animateLiftMovement(liftElement, startFloor, endFloor) {
        //     return new Promise(resolve => {
        //         const startPosition = startFloor * 70;
        //         const endPosition = endFloor * 70;
        //         const distance = Math.abs(endPosition - startPosition);
        //         const duration = distance / 35; // 35 pixels per second
    
        //         const startTime = performance.now();
        //         const animate = (currentTime) => {
        //             const elapsedTime = currentTime - startTime;
        //             if (elapsedTime < duration) {
        //                 const progress = elapsedTime / duration;
        //                 const currentPosition = startPosition + (endPosition - startPosition) * progress;
        //                 liftElement.style.bottom = `${currentPosition}px`;
        //                 requestAnimationFrame(animate);
        //             } else {
        //                 liftElement.style.bottom = `${endPosition}px`;
        //                 resolve();
        //             }
        //         };
    
        //         requestAnimationFrame(animate);
        //     });
        // }
    
        async moveLift(liftIndex, targetFloor) {
            const lift = this.lifts[liftIndex];
            lift.isMoving = true;
            lift.targetFloor = targetFloor;
            lift.direction = targetFloor > lift.currentFloor ? 'up' : 'down';
        
            const liftElement = document.querySelector(`.lift:nth-child(${liftIndex + 1})`);
            const leftDoor = liftElement.querySelector('.lift-door.left');
            const rightDoor = liftElement.querySelector('.lift-door.right');
        
            // Move lift gradually
            await this.animateLiftMovement(liftElement, lift.currentFloor, targetFloor);
        
            // After lift has reached the target floor, open the doors
            await this.animateDoors(leftDoor, rightDoor, true);
        
            // Wait for a moment
            await new Promise(resolve => setTimeout(resolve, 1000));
        
            // Close doors
            await this.animateDoors(leftDoor, rightDoor, false);
        
            lift.currentFloor = targetFloor;
            lift.isMoving = false;
            lift.direction = null;
        }
        
        animateLiftMovement(liftElement, startFloor, endFloor) {
            return new Promise(resolve => {
                const startPosition = startFloor * 70;
                const endPosition = endFloor * 70;
                const distance = Math.abs(endPosition - startPosition);
                const duration = distance / 35; // 35 pixels per second
        
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
        
        animateDoors(leftDoor, rightDoor, isOpening) {
            return new Promise(resolve => {
                const targetScale = isOpening ? 0 : 1;
                leftDoor.style.transition = 'transform 0.5s ease';
                rightDoor.style.transition = 'transform 0.5s ease';
                leftDoor.style.transform = `scaleX(${targetScale})`;
                rightDoor.style.transform = `scaleX(${targetScale})`;
                setTimeout(resolve, 500); // Match this timeout with the transition duration
            });
        }
        
        animateDoors(leftDoor, rightDoor, isOpening) {
            return new Promise(resolve => {
                const targetScale = isOpening ? 0 : 1;
                leftDoor.style.transform = `scaleX(${targetScale})`;
                rightDoor.style.transform = `scaleX(${targetScale})`;
                setTimeout(resolve, 2500);
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
        if(i!==floors-1){
        const upButton = document.createElement('button');
        upButton.className = 'floor-button up';
        upButton.textContent = '▲';
        upButton.addEventListener('click', () => liftSystem.requestLift(i, 'up'));
        floorButtons.appendChild(upButton);
    }
if(i!=0){
        const downButton = document.createElement('button');
        
        downButton.className = 'floor-button down';
        downButton.textContent = '▼';
        
            downButton.addEventListener('click', () => liftSystem.requestLift(i, 'down'));
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