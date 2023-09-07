
import React, { Component } from "react";
import { View } from "react-native";

export default class Drop {

    constructor(origin, size, snap) {
        this.origin = origin
        this.size = size
        this.snap = snap
    }

    getOrigin() {
        return this.origin;
    }

    getSize() {
        return this.size;
    }

    getSnap() {
        return this.snap;
    }

    nearestAnchor(pos) {
        relative = {x: pos.x - this.origin.x, y: pos.y - this.origin.y};
        divide = {x: (relative.x / this.snap)>>0, y: (relative.y / this.snap)>>0}

        anchor = [
            {x: (divide.x) * this.snap, y: (divide.y) * this.snap},
            {x: (divide.x) * this.snap, y: (divide.y + 1) * this.snap},
            {x: (divide.x + 1) * this.snap, y: (divide.y) * this.snap},
            {x: (divide.x + 1) * this.snap, y: (divide.y + 1) * this.snap},
        ];
        min = Infinity;
        minAnchor = null;

        anchor.forEach(anc => {
            distance = Math.sqrt(Math.pow(relative.x - anc.x, 2) + Math.pow(relative.y - anc.y, 2));
            if (distance < min) {
                min = distance
                minAnchor = anc;
            }
        });

        return minAnchor;
    }

}
