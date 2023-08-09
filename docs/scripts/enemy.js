import { gsap } from "gsap";
import * as THREE from 'three';
import Player from '/public/scripts/player';
import Bullet from '/public/scripts/bullet';
export default class Enemy{
	static enemies = []
	static speed = 0.01
	//mesh
	geometry = new THREE.DodecahedronGeometry(0.5);
	material = new THREE.MeshStandardMaterial( { color: 0x3cd070 } );
	mesh = new THREE.Mesh( this.geometry, this.material );

	constructor(position){
		this.mesh.position.set(position.x,position.y,position.z)
	}
}