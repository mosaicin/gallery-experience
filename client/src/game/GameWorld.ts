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
  room: string;
  transitioning: boolean;
  transitionProgress: number;
  roomStory: string;
};

export type InputState = {
  forward: number;
  strafe: number;
  interact: boolean;
  vertical: number;
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
  private roomCoord = new Vector3(0, 0, 0);
  private transitionElapsed = 0;
  private transitionFrom = new Vector3();
  private transitionTo = new Vector3();
  private readonly transitionDuration = 0.42;
  private transitioning = false;
  private transitionDirection = new Vector3(0, 0, 1);
  private transitionSerial = 0;
  private readonly roomStories: Record<string, string> = {
    "0,0,0": "Центральный двор: парк собирает три осколка в одну память.",
    "1,0,0": "Восточная комната: пустые рамки хранят следы тех, кто ушёл дальше.",
    "-1,0,0": "Западная комната: красный свет отмечает первую развилку маршрута.",
    "0,1,0": "Верхняя комната: потолок стал полом, и карта перевернулась.",
    "0,-1,0": "Нижняя комната: звук приходит сверху, но выход ищется внизу.",
    "0,0,1": "Северная комната: осколок показывает следующий поворот.",
    "0,0,-1": "Южная комната: тишина проверяет, помнишь ли ты обратную дорогу."
  };

  constructor(player: Mesh, shardMeshes: Mesh[], gate: Mesh, houseGlow: Mesh) {
    this.player = player;
    this.shardMeshes = shardMeshes;
    this.gate = gate;
    this.houseGlow = houseGlow;
    this.shardPositions = shardMeshes.map((mesh) => mesh.position.clone());
  }

  get isTransitioning() { return this.transitioning; }
  get roomLabel() { return `${this.roomCoord.x},${this.roomCoord.y},${this.roomCoord.z}`; }
  get transitionProgress() { return this.transitioning ? Math.min(this.transitionElapsed / this.transitionDuration, 1) : 1; }
  get transitionDirectionLabel() { return `${this.transitionDirection.x},${this.transitionDirection.y},${this.transitionDirection.z}`; }
  get transitionId() { return this.transitionSerial; }
  get roomStory() { return this.roomStories[this.roomLabel] ?? `Узел ${this.roomLabel}: геометрия комнаты меняется после входа через грань.`; }

  tryPortalTransition() {
    if (this.transitioning) return false;
    const p = this.player.position;
    const direction = p.z > 10.4 ? new Vector3(0, 0, 1) : p.z < -10.4 ? new Vector3(0, 0, -1) : p.x > 11.4 ? new Vector3(1, 0, 0) : p.x < -11.4 ? new Vector3(-1, 0, 0) : p.y > 6.1 ? new Vector3(0, 1, 0) : p.y < 0.55 ? new Vector3(0, -1, 0) : null;
    return direction ? this.requestTransition(direction) : false;
  }

  requestTransition(direction: Vector3) {
    if (this.transitioning) return false;
    const next = this.roomCoord.add(direction);
    if (Math.abs(next.x) > 1 || Math.abs(next.y) > 1 || Math.abs(next.z) > 1) return false;
    this.transitioning = true;
    this.transitionElapsed = 0;
    this.transitionDirection.copyFrom(direction);
    this.transitionSerial += 1;
    this.transitionFrom.copyFrom(this.player.position);
    this.transitionTo.copyFrom(this.player.position).addInPlace(direction.scale(10.8));
    this.roomCoord.copyFrom(next);
    return true;
  }

  reset() {
    this.player.position.copyFromFloats(0, 1.05, -8);
    this.roomCoord.copyFromFloats(0, 0, 0);
    this.transitionDirection.copyFromFloats(0, 0, 1);
    this.transitionSerial = 0;
    this.transitioning = false;
    this.transitionElapsed = 0;
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
    if (this.state !== "locked" || this.transitioning || digit < 1 || digit > 6) return;
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

    if (this.transitioning) {
      this.transitionElapsed += dt;
      const t = Math.min(this.transitionElapsed / this.transitionDuration, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      this.player.position = Vector3.Lerp(this.transitionFrom, this.transitionTo, eased);
      if (t >= 1) {
        this.transitioning = false;
        this.player.position.copyFrom(this.transitionTo);
      }
      return;
    }

    const speed = 4.5;
    const movement = new Vector3(input.strafe, input.vertical, input.forward);
    if (movement.lengthSquared() > 0) {
      movement.normalize().scaleInPlace(speed * dt);
      this.player.position.addInPlace(movement);
    }
    this.player.position.x = Math.max(-11.6, Math.min(11.6, this.player.position.x));
    this.player.position.y = Math.max(0.35, Math.min(6.3, this.player.position.y));
    this.player.position.z = Math.max(-10.7, Math.min(11.6, this.player.position.z));

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
      return { shards: this.collected.size, total: this.shardMeshes.length, state: this.state, prompt: "Цифровой выход открыт", objective: "Ночь запомнена. Нажми R, чтобы пройти снова.", lockBuffer: this.lockBuffer, lockCode: this.code.join(""), glyphs: this.glyphs, room: this.roomLabel, transitioning: this.transitioning, transitionProgress: this.transitionProgress, roomStory: this.roomStory };
    }
    if (this.state === "locked") {
      return { shards: this.collected.size, total: this.shardMeshes.length, state: this.state, prompt: "Введи цифры 1–6 на клавиатуре", objective: "Архивный дом: собери порядок шести универсальных принципов.", lockBuffer: this.lockBuffer, lockCode: this.code.join(""), glyphs: this.glyphs, room: this.roomLabel, transitioning: this.transitioning, transitionProgress: this.transitionProgress, roomStory: this.roomStory };
    }
    return { shards: this.collected.size, total: this.shardMeshes.length, state: this.state, prompt: nearby ? "E — забрать осколок памяти" : "", objective: "Стрелки — перейти в соседнюю комнату. Найди три осколка памяти.", lockBuffer: this.lockBuffer, lockCode: this.code.join(""), glyphs: this.glyphs, room: this.roomLabel, transitioning: this.transitioning, transitionProgress: this.transitionProgress, roomStory: this.roomStory };
  }
}
