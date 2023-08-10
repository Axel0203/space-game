import { gsap } from "gsap";
import * as THREE from 'three';
import Bullet from '/bullet';

export default class Player{
	scene
	dead = false
	mesh
	moving = 0;
	speed = 0.2
	constructor(geometry,material,scene){
		this.scene = scene
		this.mesh = new THREE.Mesh(geometry,material );
		this.mesh.position.set(8,1,0)
		this.mesh.rotation.x = 4;
	}
	moveRight() {
		this.moving = 1
		gsap.to(this.mesh.rotation, {
			duration: 0.1,
			z: -0.3,
		  });
		
	}
	moveLeft() {
		this.moving = -1
		gsap.to(this.mesh.rotation, {
			duration: 0.1,
			z: 0.3,
		  });
	}
	stop(num) {
		if (this.moving == num){
			this.moving = 0
		}
		gsap.to(this.mesh.rotation, {
			duration: 0.1,
			z: 0,
		  });
	}

	shoot(){
		const bullet = new Bullet(1,"player",0.2,new THREE.MeshBasicMaterial( { color: 0xffffff } ))
		bullet.capsule.position.set(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z)
		Bullet.bullets.push(bullet)
		this.scene.add( bullet.capsule );

	}
}