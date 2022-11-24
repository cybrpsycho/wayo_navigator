# Mall Navigator

This is a simple implementation of a 3D navigator using the awesome Three.JS. This solution is aimed at navigating in malls

## Prerequisites

There are requirements that need to be fulfilled for a complete navigation experience.

1. There needs to be a 3D model of the mall (only works with GLTF format due to favorable factors for web-apps i.e. size).

2. The 3D model must include named meshes (_case insensitive_) which are:
    - 'layout(n)' - the mall's blueprint (walls, stairs, ramps, lifts, etc...) for each n<sup>th</sup> floor where n >= 0
    - 'navmesh' - which will be used for path-finding
    - 'floor' - a flat plane that will be used as...well...the floor
    - '{unique_id}' - a randomized id for each store's plane

## How To Run

1.  Pull the code...

2.  Run `npm run build` in the pulled directory

3.  Run a localhost server in the folder (e.g. using LiveServer)

4.  Visit the url `http://localhost:{port}/dist/index.html`

5.  Create and dispatch a JS CustomEvent with the following specifications:

        new CustomEvent('init', {
            detail: {
                model: path_to_gltf_file,
                images: {
                    '{unique_id}': path_to_jpg_or_png_image
                }
            }
        });

    This will trigger the listener to initialize the webpage, load the model and images and finally render the output

6.  Assuming the 'navmesh' mesh was loaded, proceed to initiate a navigation request with the following CustomEvent:

        new CustomEvent('navigate', {
            detail: {
                startObjectName: '{unique_id}',
                endObjectName: '{unique_id}',
            }
        });

    This will trigger the listener to find a path between the two stores and draw a line from start to end

-   _NOTE: This was intended to be an applet so the events are supposed to be triggered via code. To run the above snippets you can use the browser's dev console, just copy, paste, edit and hit enter to run_

## Credits

[Three.JS](https://github.com/mrdoob/three.js/) by [MrDoob](https://github.com/mrdoob)

[ThreePathfinding](https://github.com/donmccurdy/three-pathfinding) by [Don McCurdy](https://github.com/donmccurdy)
