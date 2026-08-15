import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { GameWorld, HudSnapshot, InputState } from "./GameWorld";
import { AudioManager } from "./AudioManager";

export type GameHandle = {
  scene: Scene;
  world: GameWorld;
  camera: ArcRotateCamera;
  dispose: () => void;
};

type SceneOptions = {
  onHud: (snapshot: HudSnapshot) => void;
  demo?: boolean;
};

const mat = (scene: Scene, name: string, diffuse: Color3, emissive?: Color3) => {
  const material = new StandardMaterial(name, scene);
  material.diffuseColor = diffuse;
  material.specularColor = new Color3(0.03, 0.03, 0.04);
  if (emissive) material.emissiveColor = emissive;
  return material;
};

export async function createGameScene(engine: Engine, canvas: HTMLCanvasElement, options: SceneOptions): Promise<GameHandle> {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.012, 0.014, 0.027, 1);
  scene.fogMode = Scene.FOGMODE_EXP;
  scene.fogDensity = 0.012;
  scene.fogColor = new Color3(0.012, 0.014, 0.027);

  const camera = new ArcRotateCamera("park-camera", -Math.PI / 2, 1.08, 20, new Vector3(0, 0.8, 0), scene);
  camera.lowerRadiusLimit = 10;
  camera.upperRadiusLimit = 25;
  camera.lowerAlphaLimit = null;
  camera.upperAlphaLimit = null;
  camera.lowerBetaLimit = 0.16;
  camera.upperBetaLimit = Math.PI - 0.16;
  camera.wheelPrecision = 70;
  camera.attachControl(canvas, true);
  camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
  scene.activeCamera = camera;

  const ambient = new HemisphericLight("park-ambient", new Vector3(0, 1, 0), scene);
  ambient.intensity = 0.32;
  ambient.diffuse = new Color3(0.35, 0.42, 0.62);
  ambient.groundColor = new Color3(0.03, 0.025, 0.05);

  const houseLight = new PointLight("archive-light", new Vector3(0, 5, 0), scene);
  houseLight.diffuse = new Color3(1, 0.32, 0.16);
  houseLight.intensity = 18;
  houseLight.range = 14;

  const cyanLight = new PointLight("river-light", new Vector3(-8, 2, 5), scene);
  cyanLight.diffuse = new Color3(0.1, 0.7, 1);
  cyanLight.intensity = 13;
  cyanLight.range = 8;
  const magentaLight = new PointLight("workshop-light", new Vector3(8, 2, 4), scene);
  magentaLight.diffuse = new Color3(1, 0.08, 0.42);
  magentaLight.intensity = 12;
  magentaLight.range = 8;
  const limeLight = new PointLight("shrine-light", new Vector3(0, 2, -7), scene);
  limeLight.diffuse = new Color3(0.45, 1, 0.18);
  limeLight.intensity = 11;
  limeLight.range = 8;

  const glow = new GlowLayer("park-glow", scene);
  glow.intensity = 0.45;

  const floor = MeshBuilder.CreateBox("park-floor", { width: 26, depth: 24, height: 0.35 }, scene);
  floor.position.y = -0.2;
  floor.material = mat(scene, "floor-mat", new Color3(0.035, 0.045, 0.075));

  const wallMat = mat(scene, "wall-mat", new Color3(0.055, 0.045, 0.075));
  const walls = [
    { name: "north-wall", position: new Vector3(0, 1.8, 12), scale: new Vector3(26, 3.6, 0.35) },
    { name: "west-wall", position: new Vector3(-13, 1.8, 0), scale: new Vector3(0.35, 3.6, 24) },
    { name: "east-wall", position: new Vector3(13, 1.8, 0), scale: new Vector3(0.35, 3.6, 24) },
    { name: "south-wall", position: new Vector3(0, 1.8, -12), scale: new Vector3(26, 3.6, 0.35) },
  ];
  walls.forEach(({ name, position, scale }) => {
    const wall = MeshBuilder.CreateBox(name, { width: scale.x, height: scale.y, depth: scale.z }, scene);
    wall.position.copyFrom(position);
    wall.material = wallMat;
  });
  const portalMat = mat(scene, "portal-frame", new Color3(0.04, 0.08, 0.12), new Color3(0.2, 0.85, 1));
  const portalGlow = mat(scene, "portal-glow", new Color3(0.12, 0.2, 0.24), new Color3(0.1, 0.95, 1));
  const makePortal = (name: string, position: Vector3, horizontal: Vector3, vertical: Vector3) => {
    const left = MeshBuilder.CreateBox(`${name}-left`, { width: 0.18, height: vertical.y || 0.18, depth: 0.18 }, scene);
    left.position.copyFrom(position.subtract(horizontal.scale(1.25)).add(vertical.scale(0.85)));
    left.material = portalMat;
    const right = MeshBuilder.CreateBox(`${name}-right`, { width: 0.18, height: vertical.y || 0.18, depth: 0.18 }, scene);
    right.position.copyFrom(position.add(horizontal.scale(1.25)).add(vertical.scale(0.85)));
    right.material = portalMat;
    const top = MeshBuilder.CreateBox(`${name}-top`, { width: 2.7, height: 0.18, depth: 0.18 }, scene);
    top.position.copyFrom(position.add(vertical.scale(1.7)));
    top.material = portalGlow;
  };
  makePortal("portal-north", new Vector3(0, 0.05, 11.75), new Vector3(1, 0, 0), new Vector3(0, 1, 0));
  makePortal("portal-south", new Vector3(0, 0.05, -11.75), new Vector3(1, 0, 0), new Vector3(0, 1, 0));
  makePortal("portal-west", new Vector3(-12.75, 0.05, 0), new Vector3(0, 0, 1), new Vector3(0, 1, 0));
  makePortal("portal-east", new Vector3(12.75, 0.05, 0), new Vector3(0, 0, 1), new Vector3(0, 1, 0));
  const verticalDoors: Mesh[] = [];
  const makeHatch = (name: string, y: number, material: StandardMaterial) => {
    const frameA = MeshBuilder.CreateBox(`${name}-frame-a`, { width: 3.3, height: 0.18, depth: 0.18 }, scene);
    frameA.position = new Vector3(0, y, -1.58);
    frameA.material = portalMat;
    const frameB = MeshBuilder.CreateBox(`${name}-frame-b`, { width: 3.3, height: 0.18, depth: 0.18 }, scene);
    frameB.position = new Vector3(0, y, 1.58);
    frameB.material = portalMat;
    const frameC = MeshBuilder.CreateBox(`${name}-frame-c`, { width: 0.18, height: 0.18, depth: 3.3 }, scene);
    frameC.position = new Vector3(-1.58, y, 0);
    frameC.material = portalMat;
    const frameD = MeshBuilder.CreateBox(`${name}-frame-d`, { width: 0.18, height: 0.18, depth: 3.3 }, scene);
    frameD.position = new Vector3(1.58, y, 0);
    frameD.material = portalMat;
    [-0.72, 0.72].forEach((x, index) => {
      const leaf = MeshBuilder.CreateBox(`${name}-leaf-${index}`, { width: 1.35, height: 0.12, depth: 2.8 }, scene);
      leaf.position = new Vector3(x, y + (y > 3 ? -0.08 : 0.08), 0);
      leaf.material = material;
      verticalDoors.push(leaf);
    });
  };
  makeHatch("floor-door", 0.12, portalGlow);
  makeHatch("ceiling-door", 7.08, portalMat);

  const pathMat = mat(scene, "path-mat", new Color3(0.09, 0.075, 0.11));
  const path = MeshBuilder.CreateBox("central-path", { width: 4.5, depth: 24, height: 0.06 }, scene);
  path.position.y = 0.02;
  path.material = pathMat;

  const houseBase = MeshBuilder.CreateBox("archive-house", { width: 6, height: 4.4, depth: 5 }, scene);
  houseBase.position.y = 2.2;
  houseBase.material = mat(scene, "house-mat", new Color3(0.14, 0.055, 0.07));
  const houseTower = MeshBuilder.CreateBox("archive-tower", { width: 2.2, height: 4.5, depth: 2.2 }, scene);
  houseTower.position.y = 6.5;
  houseTower.material = mat(scene, "tower-mat", new Color3(0.19, 0.07, 0.09));
  const houseGlow = MeshBuilder.CreateBox("archive-glow", { width: 3.7, height: 2, depth: 0.12 }, scene);
  houseGlow.position = new Vector3(0, 2.3, -2.53);
  houseGlow.material = mat(scene, "house-glow", new Color3(0.25, 0.07, 0.04), new Color3(1, 0.18, 0.05));

  const gateMat = mat(scene, "gate-mat", new Color3(0.25, 0.13, 0.06), new Color3(0.5, 0.18, 0.04));
  const gate = MeshBuilder.CreateBox("exit-gate", { width: 4.4, height: 3.2, depth: 0.35 }, scene);
  gate.position = new Vector3(0, 1.6, -11.8);
  gate.material = gateMat;

  const shardColors = [new Color3(0.05, 0.75, 1), new Color3(1, 0.05, 0.38), new Color3(0.5, 1, 0.12)];
  const shardPositions = [new Vector3(-8, 1.15, 5), new Vector3(8, 1.15, 4), new Vector3(0, 1.15, -7)];
  const shardMeshes = shardPositions.map((position, index) => {
    const shard = MeshBuilder.CreatePolyhedron(`memory-shard-${index}`, { type: 1, size: 1.35 }, scene);
    shard.position.copyFrom(position);
    shard.material = mat(scene, `shard-mat-${index}`, shardColors[index].scale(0.42), shardColors[index]);
    return shard;
  });

  const player = MeshBuilder.CreateBox("player", { width: 0.9, height: 1.5, depth: 0.9 }, scene);
  player.position = new Vector3(0, 1.05, -8);
  player.material = mat(scene, "player-mat", new Color3(0.055, 0.07, 0.11), new Color3(0.03, 0.05, 0.1));

  const propMat = mat(scene, "prop-mat", new Color3(0.11, 0.12, 0.17));
  [-9, -5, 5, 9].forEach((x, index) => {
    const lamp = MeshBuilder.CreateBox(`lamp-${index}`, { width: 0.32, height: 2.5, depth: 0.32 }, scene);
    lamp.position = new Vector3(x, 1.25, 0.5);
    lamp.material = propMat;
    const bulb = MeshBuilder.CreateBox(`bulb-${index}`, { width: 0.5, height: 0.5, depth: 0.5 }, scene);
    bulb.position = new Vector3(x, 2.6, 0.5);
    bulb.material = mat(scene, `bulb-mat-${index}`, new Color3(0.32, 0.18, 0.05), new Color3(1, 0.35, 0.05));
  });

  const world = new GameWorld(player, shardMeshes, gate, houseGlow);
  const audio = new AudioManager();
  const keys = new Set<string>();
  let pointerActive = false;
  let touchId: number | null = null;
  let touchX = 0;
  let touchY = 0;
  let lastHud = "";
  let demoTime = 0;
  let previousShards = 0;
  let wasTransitioning = false;
  let previousState = world.snapshot.state;
  const down = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    const directions: Record<string, Vector3> = {
      arrowleft: new Vector3(-1, 0, 0),
      arrowright: new Vector3(1, 0, 0),
      arrowup: new Vector3(0, 0, 1),
      arrowdown: new Vector3(0, 0, -1),
      pageup: new Vector3(0, 1, 0),
      pagedown: new Vector3(0, -1, 0),
    };
    if (directions[key]) {
      event.preventDefault();
      if (world.requestTransition(directions[key])) audio.transition();
      return;
    }
    if (key === "e" && world.tryPortalTransition()) {
      audio.transition();
      return;
    }
    keys.add(key);
    const digit = Number(event.key);
    if (Number.isInteger(digit) && digit >= 1 && digit <= 6) world.submitDigit(digit);
  };
  const up = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());
  const pointer = (event: PointerEvent) => { pointerActive = true; audio.unlock(); if (event.pointerType === "touch") { touchId = event.pointerId; touchX = event.clientX; touchY = event.clientY; canvas.setPointerCapture(event.pointerId); } };
  const pointerMove = (event: PointerEvent) => {
    if (touchId !== event.pointerId) return;
    const dx = event.clientX - touchX;
    const dy = event.clientY - touchY;
    touchX = event.clientX;
    touchY = event.clientY;
    camera.alpha -= dx * 0.012;
    camera.beta = Math.max(0.16, Math.min(Math.PI - 0.16, camera.beta + dy * 0.009));
  };
  const pointerUp = (event: PointerEvent) => { if (touchId === event.pointerId) { touchId = null; canvas.releasePointerCapture(event.pointerId); } };

  const glyphColors = [new Color3(1, 0.34, 0.16), new Color3(0.36, 0.88, 1), new Color3(0.72, 0.4, 1), new Color3(1, 0.1, 0.38), new Color3(0.55, 1, 0.22), new Color3(1, 0.8, 0.24)];
  const facePositions = [new Vector3(-10, 2.3, 10.8), new Vector3(-4, 2.3, 10.8), new Vector3(4, 2.3, 10.8), new Vector3(10, 2.3, 10.8), new Vector3(-10.8, 2.3, -6), new Vector3(10.8, 2.3, -6)];
  facePositions.forEach((position, index) => {
    const panel = MeshBuilder.CreateBox(`cube-face-${index}`, { width: 1.35, height: 1.35, depth: 0.18 }, scene);
    panel.position.copyFrom(position);
    panel.material = mat(scene, `glyph-face-${index}`, glyphColors[index].scale(0.18), glyphColors[index].scale(0.55));
  });

  const modulePositions = [-10, -6, -2, 2, 6, 10].flatMap((x) => [new Vector3(x, 4.6, 10.9), new Vector3(x, 4.6, -10.2)]);
  const roomModules: Mesh[] = [];
  const roomModuleBases = modulePositions.map((position) => position.clone());
  modulePositions.forEach((position, index) => {
    const module = MeshBuilder.CreateBox(`room-module-${index}`, { width: 2.7, height: 2.7, depth: 0.3 }, scene);
    module.position.copyFrom(position);
    module.material = mat(scene, `room-module-mat-${index}`, new Color3(0.035, 0.05, 0.085), glyphColors[index % glyphColors.length].scale(0.18));
    roomModules.push(module);
    const seam = MeshBuilder.CreateBox(`room-seam-${index}`, { width: 1.7, height: 0.05, depth: 0.34 }, scene);
    seam.position = position.add(new Vector3(0, -0.8, 0));
    seam.material = mat(scene, `room-seam-mat-${index}`, glyphColors[index % glyphColors.length].scale(0.3), glyphColors[index % glyphColors.length].scale(0.8));
  });
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  canvas.addEventListener("pointerdown", pointer);
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerup", pointerUp);
  canvas.addEventListener("pointercancel", pointerUp);

  const beforeRender = scene.onBeforeRenderObservable.add(() => {
    const dt = Math.min(engine.getDeltaTime() / 1000, 0.05);
    demoTime += dt;
    const demo = options.demo || keys.has("demo");
    const input: InputState = {
      forward: (keys.has("w") ? 1 : 0) - (keys.has("s") ? 1 : 0),
      strafe: (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0),
      vertical: (keys.has(" ") || keys.has("space") ? 1 : 0) - (keys.has("shift") ? 1 : 0),
      interact: keys.has("e"),
      reset: keys.has("r"),
    };
    if (demo) {
      input.forward = Math.sin(demoTime * 0.55) > -0.15 ? 1 : 0;
      input.strafe = Math.sin(demoTime * 0.34);
      input.interact = Math.floor(demoTime) % 3 === 0;
    }
    world.update(dt, input);
    const roomSignature = world.roomLabel.split(",").map(Number).reduce((sum, value, index) => sum + value * [3, 5, 7][index], 0);
    roomModules.forEach((module, index) => {
      const base = roomModuleBases[index];
      const offset = ((roomSignature + index * 2) % 3) - 1;
      module.position.x = base.x + offset * 0.45;
      module.position.y = base.y + (((roomSignature + index) % 2) ? 0.35 : -0.18);
      module.rotation.y = roomSignature * 0.12 + index * 0.04;
      if (module.material instanceof StandardMaterial) module.material.emissiveColor = glyphColors[(index + Math.abs(roomSignature)) % glyphColors.length].scale(0.18);
    });
    const [transitionDx, transitionDy, transitionDz] = world.transitionDirectionLabel.split(",").map(Number);
    const hatchOpening = world.isTransitioning && transitionDy !== 0 ? Math.sin(world.transitionProgress * Math.PI) * 0.9 : 0;
    verticalDoors.forEach((door, index) => { door.rotation.y = index % 2 === 0 ? hatchOpening : -hatchOpening; });
    if (wasTransitioning && !world.isTransitioning) {
      const [dx, dy, dz] = world.transitionDirectionLabel.split(",").map(Number);
      if (dx > 0) camera.alpha = -Math.PI / 2;
      if (dx < 0) camera.alpha = Math.PI / 2;
      if (dz > 0) camera.alpha = Math.PI;
      if (dz < 0) camera.alpha = 0;
      if (dy > 0) camera.beta = 0.22;
      if (dy < 0) camera.beta = Math.PI - 0.22;
    }
    wasTransitioning = world.isTransitioning;
    camera.target.copyFrom(player.position);
    const snapshot = world.snapshot;
    if (snapshot.shards > previousShards) audio.collect();
    if (snapshot.state === "locked" && previousState !== "locked") audio.transition();
    if (snapshot.state === "complete" && previousState !== "complete") audio.exit();
    previousShards = snapshot.shards;
    previousState = snapshot.state;
    const hudKey = `${snapshot.shards}-${snapshot.state}-${snapshot.prompt}-${snapshot.objective}-${snapshot.room}-${snapshot.transitioning}-${Math.floor(snapshot.transitionProgress * 10)}`;
    if (hudKey !== lastHud) {
      lastHud = hudKey;
      options.onHud(snapshot);
    }
    shardMeshes.forEach((shard, index) => {
      if (shard.isVisible) {
        shard.rotation.y += dt * (1.2 + index * 0.25);
        shard.position.y = shardPositions[index].y + Math.sin(demoTime * 2 + index) * 0.12;
      }
    });
    if (pointerActive) camera.alpha += Math.sin(demoTime * 0.18) * dt * 0.03;
  });

  return {
    scene,
    world,
    camera,
    dispose: () => {
      if (beforeRender) scene.onBeforeRenderObservable.remove(beforeRender);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      canvas.removeEventListener("pointerdown", pointer);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerUp);
      camera.detachControl();
      scene.dispose();
    },
  };
}
