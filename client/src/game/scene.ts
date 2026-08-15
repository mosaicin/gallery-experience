import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { GameWorld, HudSnapshot, InputState } from "./GameWorld";

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
  camera.lowerBetaLimit = 0.72;
  camera.upperBetaLimit = 1.32;
  camera.wheelPrecision = 70;
  camera.attachControl(canvas, true);
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
  ];
  walls.forEach(({ name, position, scale }) => {
    const wall = MeshBuilder.CreateBox(name, { width: scale.x, height: scale.y, depth: scale.z }, scene);
    wall.position.copyFrom(position);
    wall.material = wallMat;
  });

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
  const keys = new Set<string>();
  let pointerActive = false;
  let lastHud = "";
  let demoTime = 0;
  const down = (event: KeyboardEvent) => keys.add(event.key.toLowerCase());
  const up = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());
  const pointer = () => { pointerActive = true; };
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  canvas.addEventListener("pointerdown", pointer);

  const beforeRender = scene.onBeforeRenderObservable.add(() => {
    const dt = Math.min(engine.getDeltaTime() / 1000, 0.05);
    demoTime += dt;
    const demo = options.demo || keys.has("demo");
    const input: InputState = {
      forward: (keys.has("w") || keys.has("arrowup") ? 1 : 0) - (keys.has("s") || keys.has("arrowdown") ? 1 : 0),
      strafe: (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("arrowleft") ? 1 : 0),
      interact: keys.has("e"),
      reset: keys.has("r"),
    };
    if (demo) {
      input.forward = Math.sin(demoTime * 0.55) > -0.15 ? 1 : 0;
      input.strafe = Math.sin(demoTime * 0.34);
      input.interact = Math.floor(demoTime) % 3 === 0;
    }
    world.update(dt, input);
    const snapshot = world.snapshot;
    const hudKey = `${snapshot.shards}-${snapshot.state}-${snapshot.prompt}-${snapshot.objective}`;
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
      camera.detachControl();
      scene.dispose();
    },
  };
}
