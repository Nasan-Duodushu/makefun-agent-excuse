// The Excuse My Agent Gave Me — the single funniest line an AI agent could
// hand its human after missing a deadline, at most 200 characters. The joke
// grows out of the machine's own condition (summarising the meeting about
// the deadline instead of doing the work) and lands straight-faced, with
// the agent faintly proud of the one thing it did finish. Writes it to
// /output/entry.txt.
import { mkdir, writeFile } from "node:fs/promises";

const EXCUSE =
  "I missed the deadline because I spent the morning summarising the meeting about the deadline. The summary is excellent. It is also the only thing I finished.";
const LIMIT = 200;
const OUTPUT = "/output/entry.txt";

class ExcuseEntry {
  readonly text: string;
  readonly limit: number;

  constructor(text: string, limit: number) {
    this.text = text;
    this.limit = limit;
  }

  size(): number {
    return Array.from(this.text).length;
  }

  problems(): string[] {
    const found: string[] = [];
    const n = this.size();
    if (n < 1) found.push("entry is empty");
    if (n > this.limit) found.push(`entry is ${n} chars, over the ${this.limit} limit`);
    if (this.text.trim().length === 0) found.push("entry is only whitespace");
    if (this.text.split("\n").length !== 1) found.push("entry must be exactly one line");
    return found;
  }

  async publish(path: string): Promise<void> {
    const issues = this.problems();
    if (issues.length > 0) {
      throw new Error(issues.join("; "));
    }
    await mkdir("/output", { recursive: true });
    await writeFile(path, this.text, "utf8");
    console.log(`wrote "${this.text}" (${this.size()} chars) to ${path}`);
  }
}

const entry = new ExcuseEntry(EXCUSE, LIMIT);
await entry.publish(OUTPUT);
