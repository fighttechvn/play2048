import { Container, Graphics, Text } from "pixi.js";
import { tileFontSize, tileStyle } from "./theme";

// One on-screen tile: a rounded rectangle + centered number. The container's
// origin is its center so scale-pop animations stay anchored.

export class TileView extends Container {
  readonly tileId: number;
  value: number;
  private bg = new Graphics();
  private numberText: Text;
  private size: number;

  constructor(tileId: number, value: number, size: number) {
    super();
    this.tileId = tileId;
    this.value = value;
    this.size = size;

    this.addChild(this.bg);
    this.numberText = new Text(String(value), {
      fontFamily: "-apple-system, Helvetica, Arial, sans-serif",
      fontSize: tileFontSize(value, size),
      fontWeight: "800",
      fill: tileStyle(value).text,
      align: "center",
    });
    this.numberText.anchor.set(0.5);
    this.addChild(this.numberText);

    this.draw();
  }

  setValue(value: number): void {
    if (value === this.value) return;
    this.value = value;
    this.numberText.text = String(value);
    this.numberText.style.fontSize = tileFontSize(value, this.size);
    this.numberText.style.fill = tileStyle(value).text;
    this.draw();
  }

  private draw(): void {
    const s = this.size;
    const r = Math.round(s * 0.12);
    this.bg.clear();
    this.bg.beginFill(tileStyle(this.value).bg).drawRoundedRect(-s / 2, -s / 2, s, s, r).endFill();
  }
}
