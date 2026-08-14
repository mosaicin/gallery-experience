import { useEffect, useRef } from "react";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Lights/Shadows/shadowGenerator";

const ARTWORKS = [
  "/manus-storage/gallery-painting-one_e021c680.png",
  "/manus-storage/gallery-painting-two_b8354476.png",
  "/manus-storage/gallery-painting-three_6e637198.png",
];

/** Style note: Nocturne Museum — Babylon is the hidden spatial layer; keep geometry matte, lighting directional, and the camera slow enough to feel like looking. */
type Props = { entered: boolean; nightMode: boolean; selected: number; onSelect: (value: number) => void };

export default function GalleryCanvas({ entered, nightMode, selected, onSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<FreeCamera | null>(null);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, adaptToDeviceRatio: true });
    const scene = new Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = new Color3(0.018, 0.018, 0.018).toColor4(1);

    const camera = new FreeCamera("gallery-camera", new Vector3(0, 1.7, -8), scene);
    camera.attachControl(canvas, true);
    camera.speed = 0.14;
    camera.angularSensibility = 5500;
    camera.inertia = 0.72;
    camera.keysUp = [87, 38];
    camera.keysDown = [83, 40];
    camera.keysLeft = [65, 37];
    camera.keysRight = [68, 39];
    camera.minZ = 0.1;
    camera.maxZ = 80;
    cameraRef.current = camera;

    const ambient = new HemisphericLight("ambient", new Vector3(0, 1, 0), scene);
    ambient.intensity = 0.17;
    ambient.diffuse = new Color3(0.7, 0.69, 0.63);
    const beam = new PointLight("beam", new Vector3(0, 5.2, 1), scene);
    beam.intensity = 25;
    beam.range = 16;
    beam.diffuse = new Color3(1, 0.73, 0.39);

    const floorMat = new StandardMaterial("floor-mat", scene);
    floorMat.diffuseColor = new Color3(0.06, 0.055, 0.05);
    floorMat.specularColor = new Color3(0.22, 0.18, 0.12);
    const wallMat = new StandardMaterial("wall-mat", scene);
    wallMat.diffuseColor = new Color3(0.032, 0.032, 0.031);
    wallMat.specularColor = new Color3(0.03, 0.03, 0.03);

    const floor = MeshBuilder.CreateGround("floor", { width: 28, height: 34 }, scene);
    floor.material = floorMat;
    const backWall = MeshBuilder.CreateBox("back-wall", { width: 28, height: 8, depth: 0.25 }, scene);
    backWall.position = new Vector3(0, 4, 9);
    backWall.material = wallMat;
    const leftWall = MeshBuilder.CreateBox("left-wall", { width: 0.25, height: 8, depth: 34 }, scene);
    leftWall.position = new Vector3(-14, 4, -8);
    leftWall.material = wallMat;
    const rightWall = leftWall.clone("right-wall");
    rightWall.position.x = 14;

    const frameMaterial = new StandardMaterial("frame", scene);
    frameMaterial.diffuseColor = new Color3(0.15, 0.12, 0.09);
    ARTWORKS.forEach((url, index) => {
      const frame = MeshBuilder.CreateBox(`frame-${index}`, { width: index === 1 ? 3.3 : 2.8, height: index === 1 ? 3.3 : 3.8, depth: 0.16 }, scene);
      frame.position = new Vector3((index - 1) * 5.2, 2.65, 8.78);
      frame.material = frameMaterial;
      const art = MeshBuilder.CreatePlane(`art-${index}`, { width: index === 1 ? 3 : 2.5, height: index === 1 ? 3 : 3.5 }, scene);
      art.position = new Vector3((index - 1) * 5.2, 2.65, 8.67);
      art.rotation.y = Math.PI;
      const artMat = new StandardMaterial(`art-material-${index}`, scene);
      artMat.diffuseTexture = new Texture(url, scene);
      artMat.emissiveColor = new Color3(0.16, 0.13, 0.1);
      art.material = artMat;
      const light = new PointLight(`art-light-${index}`, new Vector3((index - 1) * 5.2, 5.6, 7.8), scene);
      light.intensity = index === selectedRef.current ? 16 : 9;
      light.range = 7;
      light.diffuse = index === 1 ? new Color3(0.5, 0.63, 1) : new Color3(1, 0.76, 0.45);
    });

    const pedestals = [-5, 0, 5].map((x, index) => {
      const pedestal = MeshBuilder.CreateBox(`pedestal-${index}`, { width: 1.25, height: 1.1, depth: 1.25 }, scene);
      pedestal.position = new Vector3(x, 0.55, 4.1);
      pedestal.material = wallMat;
      return pedestal;
    });
    void pedestals;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") onSelect((selectedRef.current + 1) % ARTWORKS.length);
      if (event.key === "ArrowLeft") onSelect((selectedRef.current - 1 + ARTWORKS.length) % ARTWORKS.length);
    };
    window.addEventListener("keydown", handleKey);
    engine.runRenderLoop(() => scene.render());
    const resize = () => engine.resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", resize);
      scene.dispose();
      engine.dispose();
      sceneRef.current = null;
    };
  }, [onSelect]);

  useEffect(() => {
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    if (!camera || !scene) return;
    camera.position = entered ? new Vector3(0, 1.7, -7.5) : new Vector3(0, 1.7, -14);
    scene.clearColor = (nightMode ? new Color3(0.004, 0.004, 0.004) : new Color3(0.018, 0.018, 0.018)).toColor4(1);
  }, [entered, nightMode]);

  return <canvas ref={canvasRef} className={`gallery-canvas ${entered ? "visible" : "dimmed"}`} aria-label="Interactive 3D gallery" />;
}
