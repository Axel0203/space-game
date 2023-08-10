import './style.css'

import { gsap } from "gsap";
import * as THREE from 'three';
import Player from '/player';
import Enemy from '/enemy';
import Bullet from '/bullet';
import gameMusicUrl from '/sounds/gameMusic.mp3'
import winSoundUrl from '/sounds/winSound.mp3'
import loseSoundUrl from '/sounds/loseSound.mp3'
import spaceTextureUrl from "/textures/space.jpg"
import shootAudioUrl from '/sounds/shoot.mp3'

if (navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)) {
          const container = document.querySelector("body")
          container.innerHTML=`
          <h1>Desktop-only website</h1>
          <div class="social">
                <h2>Check my socials ;) </h2>
                <ul>
                    <li><a target="_blank" href="https://www.linkedin.com/in/axel-ferrufino/">linkedin -></a></li>
                    <li><a target="_blank" href="https://www.instagram.com/axel._.fer/">instagram -></a></li>
                </ul>
            </div>
          `
} else {

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
const canvas = renderer.domElement 
const gameMusic = new Audio(gameMusicUrl);
gameMusic.volume = 0.1
const winSound = new Audio(winSoundUrl); 
const loseSound = new Audio(loseSoundUrl); 
const spaceTexture = new THREE.TextureLoader().load(spaceTextureUrl)
document.body.appendChild( canvas );

const player = new Player(new THREE.ConeGeometry( 1, 1,3 ) , new THREE.MeshStandardMaterial( {color: 0x0B3D91} ),scene);
scene.add( player.mesh );

const createEnemies = () =>{
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 16; j++) {
			if(Math.random() < 0.5){
				const enemy = new Enemy(new THREE.Vector3(j,16-i,0))
				Enemy.enemies.push(enemy)
				scene.add( enemy.mesh );
			}
		}
	}
}
createEnemies()

scene.background = spaceTexture


const addStar = () => {
	const geometry = new THREE.SphereGeometry(0.25, 24, 24);
	const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
	const star = new THREE.Mesh(geometry, material);
  
	const [x, y, z] = Array(3)
	  .fill()
	  .map(() => THREE.MathUtils.randFloatSpread(100));
  
	star.position.set(x, y, -10);
	scene.add(star);
}
  
Array(200).fill().forEach(addStar);

//lights
const light = new THREE.AmbientLight( 0xffffff , 1); // soft white light
scene.add( light );
const directionalLight = new THREE.DirectionalLight( 0xFFE484 , 2 );
directionalLight.position.set(8,1,8)
directionalLight.lookAt(8,8,0)
scene.add( directionalLight );

camera.position.set(8,8.3,12)
camera.lookAt(new THREE.Vector3(8,8.3,0))

document.body.addEventListener('keydown',(event) =>{
	switch (event.key) {
	case 'a':
		player.moveLeft()
		break;
	case 'd':
		player.moveRight()
		break;
	case ' ':
		player.shoot()
		var shootAudio = new Audio(shootAudioUrl); 
        shootAudio.play();
		break;
	default:
		console.log(`keypressed`);
	}
})

document.body.addEventListener('keyup',(event) =>{
	switch (event.key) {
		case 'a':
			player.stop(-1)
			break;
		case 'd':
			player.stop(1)
			break;
		default:
		}
	
})

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

const startScene = () => {
	let stop = false;
	let fpsInterval, startTime, now, then, elapsed;
  
	const startAnimating = (fps) => {
	  console.log("Animation starting...");
	  fpsInterval = 1000 / fps;
	  then = window.performance.now();
	  startTime = then;
	  animate();
	};

	const animate = (newtime) => {
	  // stop
	  if (stop) {
		return;
	  }
	  // request another frame
	  requestAnimationFrame(animate);
	  // calc elapsed time since last loop
	  now = newtime;
	  elapsed = now - then;
	  // if enough time has elapsed, draw the next frame
	  if (elapsed > fpsInterval) {
		// Get ready for next frame by setting then=now, but...
		// Also, adjust for fpsInterval not being multiple of 16.67
		then = now - (elapsed % fpsInterval);
  
		//LOGIN

		//player movement
		player.mesh.position.x +=player.moving*player.speed
		if (player.mesh.position.x > 16 ) player.mesh.position.x = 15.999999
		if (player.mesh.position.x < 0 ) player.mesh.position.x = 0.000001
		
		//bullets movement and hit detection
		Bullet.bullets.forEach(bullet => {
			bullet.capsule.position.y += bullet.moving*bullet.speed
			if (bullet.shooter === "player"){
				Enemy.enemies.forEach(enemy  =>{
					if (bullet.capsule.position.distanceTo(enemy.mesh.position) < 0.5){
						bullet.capsule.removeFromParent()
						enemy.mesh.removeFromParent()
						Bullet.bullets = Bullet.bullets.filter(elem => elem.capsule != bullet.capsule)
						Enemy.enemies = Enemy.enemies.filter(elem => elem.mesh != enemy.mesh)
						
					}
				})
			}else if( bullet.shooter === "enemy"){
				if (bullet.capsule.position.distanceTo(player.mesh.position) < 0.5){
					player.dead = true
				}
			}
		});
		
		if (Enemy.enemies.length === 0){
			document.querySelector("main").innerHTML = "<h1> YOU WIN <h1>" 
        	winSound.play();
		}else if( player.dead === true){
			document.querySelector("main").innerHTML = "<h1> YOU LOSE <h1>" 
			player.mesh.removeFromParent()
			stop = true;
        	loseSound.play();
		}

		//enemies movement and shooting
		enemyMovementClock++
		if( enemyMovementClock == 256){
			enemyMovementClock = 0
			Enemy.speed = -Enemy.speed
		}
		Enemy.enemies.forEach(enemy =>{
			enemy.mesh.position.x += Enemy.speed
			if (Math.random() < 0.0003){
				const bullet = new Bullet(-1,"enemy",0.1,new THREE.MeshBasicMaterial( { color: 0xff0000 } ))
				bullet.capsule.position.set(enemy.mesh.position.x,enemy.mesh.position.y,enemy.mesh.position.z)
				Bullet.bullets.push(bullet)
				scene.add( bullet.capsule );
			}
		})


		renderer.render(scene, camera);
	  }
	};
	
	startAnimating(60);
};
let enemyMovementClock = 0;

document.querySelector("#mute").addEventListener("click",() =>{
	gameMusic.pause()
})
document.querySelector("#start").addEventListener("click",() =>{
	gameMusic.play()
	document.querySelector("#menu").style.display = "none"
	startScene();
})
}