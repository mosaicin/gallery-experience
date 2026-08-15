import { useEffect, useRef } from "react";
import { Engine } from "@babylonjs/core/Engines/engine";
import { createGameScene, GameHandle } from "../game/scene";
import { HudSnapshot } from "../game/GameWorld";

/** Style note: Darkland game canvas is the spatial layer; React owns the HUD and the canvas remains full-screen. */
type Props = { demo?: boolean; onHud: (snapshot: HudSnapshot) => void };

export default function DarklandGameCanvas({ demo = false, onHud }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const startedRef = useRef(false);
  const handleRef = useRef<GameHandle | null>(null);
  const hudRef = useRef(onHud);
  hudRef.current = onHud;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || startedRef.current) return;
    startedRef.current = true;
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, adaptToDeviceRatio: true });
    let disposed = false;
    createGameScene(engine, canvas, { demo, onHud: (snapshot) => hudRef.current(snapshot) }).then((handle) => {
      if (disposed) {
        handle.dispose();
        engine.dispose();
        return;
      }
      handleRef.current = handle;
      engine.runRenderLoop(() => handle.scene.render());
    });
    const resize = () => engine.resize();
    window.addEventListener("resize", resize);
    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      handleRef.current?.dispose();
      handleRef.current = null;
      engine.dispose();
      startedRef.current = false;
    };
  }, [demo]);

  return <canvas ref={canvasRef} className="darkland-canvas" aria-label="Интерактивный кубический ночной парк" />;
}
