import {World} from './world/World';

function main() {
    const container = document.getElementById("scene-container")!;

    const world = new World(container);

    world.render();
}

main();