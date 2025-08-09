import { GameObject } from "@/core/model/gameObject";

export class CollisionController {
  static isColliding(a: GameObject, b: GameObject): boolean {
    if (!a || !b) return false;
    return (
      a.x < b.x + (b.width || 0) &&
      a.x + (a.width || 0) > b.x &&
      a.y < b.y + (b.height || 0) &&
      a.y + (a.height || 0) > b.y
    );
  }

  static checkAll(
    objects: GameObject[],
    targets: GameObject[],
    callback: (a: GameObject, b: GameObject) => void
  ) {
    for (let i = objects.length - 1; i >= 0; i--) {
      for (let j = targets.length - 1; j >= 0; j--) {
        if (CollisionController.isColliding(objects[i], targets[j])) {
          callback(objects[i], targets[j]);
        }
      }
    }
  }
}
