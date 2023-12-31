import * as THREE from 'three';

export default class Bullet{
	static bullets = []
	moving
	speed = 0.1
	//mesh
	geometry = new THREE.SphereGeometry( 0.2, 4, 1 ); 
	material
	capsule
	shooter
	constructor(moving,shooter,speed,material){
		this.speed = speed
		this.shooter = shooter
		this.moving = moving
		this.material = material
		this.capsule = new THREE.Mesh( this.geometry, this.material );
	}
}