import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

export type GameState = "explore" | "locked" | "complete";

export type HudSnapshot = {
  shards: number;
  total: number;
  state: GameState;
  prompt: string;
  objective: string;
  lockBuffer: string;
  lockCode: string;
  glyphs: string[];
};

export type InputState = {
  forward: number;
  strafe: number;
  interact: boolean;
  reset: boolean;
};

export class GameWorld {
  readonly player: Mesh;
  readonly shardMeshes: Mesh[];
  readonly gate: Mesh;
  readonly houseGlow: Mesh;
  readonly shardPositions: Vector3[];
  readonly glyphs = ["Милость", "Вопрос", "Равновесие", "Память", "Забота", "Выбор"];
  private readonly code = [2, 5, 1, 4, 6, 3];
  private collected = new Set<number>();
  private state: GameState = "explore";
  private interactLatch = false;
  private resetLatch = false;
  private lockBuffer = "";

  constructor(player: Mesh, shardMeshes: Mesh[], gate: Mesh, houseGlow: Mesh) {
    this.player = player;
    this.shardMeshes = shardMeshes;
    this.gate = gate;
    this.houseGlow = houseGlow;
    this.shardPositions = shardMeshes.map((mesh) => mesh.position.clone());
  }

  reset() {
    this.player.position.copyFromFloats(0, 1.05, -8);
    this.collected.clear();
    this.state = "explore";
    this.lockBuffer = "";
    this.shardMeshes.forEach((mesh) => {
      mesh.isVisible = true;
      mesh.scaling.setAll(1);
    });
    this.gate.position.y = 1.6;
    this.houseGlow.scaling.setAll(1);
  }

  submitDigit(digit: number) {
    if (this.state !== "locked" || digit < 1 || digit > 6) return;
    this.lockBuffer += String(digit);
    const expected = this.code.slice(0, this.lockBuffer.length).join("");
    if (!expected.startsWith(this.lockBuffer)) {
      this.lockBuffer = "";
      return;
    }
    if (this.lockBuffer.length === this.code.length) {
      this.state = "complete";
      this.gate.position.y = -1.1;
      this.houseGlow.scaling.setAll(1.45);
    }
  }

  update(dt: number, input: InputState) {
    if (input.reset && !this.resetLatch) this.reset();
    this.resetLatch = input.reset;

    const speed = 4.5;
    const movement = new Vector3(input.strafe, 0, input.forward);
    if (movement.lengthSquared() > 0) {
      movement.normalize().scaleInPlace(speed * dt);
      this.player.position.addInPlace(movement);
    }
    this.player.position.x = Math.max(-11.2, Math.min(11.2, this.player.position.x));
    this.player.position.z = Math.max(-10.5, Math.min(11.2, this.player.position.z));

    const nearby = this.shardPositions.findIndex((position, index) => !this.collected.has(index) && Vector3.Distance(this.player.position, position) < 1.5);
    if (nearby >= 0 && input.interact && !this.interactLatch) {
      this.collected.add(nearby);
      this.shardMeshes[nearby].isVisible = false;
      if (this.collected.size === this.shardMeshes.length) {
        this.state = "locked";
        this.houseGlow.scaling.setAll(1.2);
      }
    }
    this.interactLatch = input.interact;
  }

  get snapshot(): HudSnapshot {
    const nearby = this.shardPositions.some((position, index) => !this.collected.has(index) && Vector3.Distance(this.player.position, position) < 1.5);
    if (this.state === "complete") {
      return { shards: this.collected.size, total: this.shardMeshes.length, state: this.state, prompt: "Цифровой выход открыт", objective: "Ночь запомнена. Нажми R, чтобы пройти снова.", lockBuffer: this.lockBuffer, lockCode: this.code.join(""), glyphs: this.glyphs };
    }
    if (this.state === "locked") {
      return { shards: this.collected.size, total: this.shardMeshes.length, state: this.state, prompt: "Введи цифры 1–6 на клавиатуре", objective: "Архивный дом: собери порядок шести универсальных принципов.", lockBuffer: this.lockBuffer, lockCode: this.code.join(""), glyphs: this.glyphs };
    }
    return { shards: this.collected.size, total: this.shardMeshes.length, state: this.state, prompt: nearby ? "E — забрать осколок памяти" : "", objective: "Найди три осколка памяти.", lockBuffer: this.lockBuffer, lockCode: this.code.join(""), glyphs: this.glyphs };
  }
}
