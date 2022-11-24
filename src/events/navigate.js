import { Pathfinding, PathfindingHelper } from "three-pathfinding";
import { render, scene } from "../core";

export default function navigate(event) {
    const pathfinding = new Pathfinding();
    const helper = new PathfindingHelper();
    const zoneId = 'level';

    let navmesh = scene.getObjectByName('navmesh');

    pathfinding.setZoneData(zoneId, Pathfinding.createZone(navmesh.geometry));

    let startPos = scene.getObjectByName(event.detail.startObjectName).position;
    let endPos = scene.getObjectByName(event.detail.endObjectName).position;

    let startGroupId = pathfinding.getGroup(zoneId, startPos);
    let startNode = pathfinding.getClosestNode(startPos, zoneId, startGroupId);

    let endGroupId = pathfinding.getGroup(zoneId, endPos);
    let endNode = pathfinding.getClosestNode(endPos, zoneId, endGroupId);

    let path = pathfinding.findPath(
        startNode.centroid,
        endNode.centroid,
        zoneId,
        startGroupId
    );

    scene.add(helper);

    helper.setPlayerPosition(startNode.centroid);
    helper.setTargetPosition(endNode.centroid);
    helper.setPath(path);

    render();
}
