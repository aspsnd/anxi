import { v1 as uuid } from "uuid";
import { resolve } from 'path';
import { promises, Stats, readFileSync } from 'fs';
const { readdir, readFile, stat, writeFile, unlink, access, watch } = promises;
import { packAsync, TrimMode, TexturePackerOptions } from "free-tex-packer-core";
export { TrimMode };
export interface PackerConfig extends TexturePackerOptions {
  in: string
  out: string
  exclude: RegExp
  watch: boolean
  mapFile: string
  include: RegExp
}
export class Packer {
  constructor(public config: PackerConfig) {
    this.loadMap();
    if (config.watch) {
      this.watch();
    } else {
      this.runCareful(config.in);
    }
  }
  async watch() {
    const watcher = watch(this.config.in);
    for await (const c of watcher) {
      const { filename } = c;
      console.log(filename);
    }
  }
  async writeMap() {
    await writeFile(this.config.mapFile, JSON.stringify(this.map, undefined, 4));
    this.clearUselessTex();
  }
  async clearUselessTex() {
    const result = await readdir(this.config.out);
    const values = Object.values(this.map);
    for (const filename of result) {
      if (!values.includes(filename.split('.')[0])) {
        await unlink(resolve(this.config.out, filename));
        console.log('delete useless file: ', filename);
      }
    }
  }
  map: Record<string, string> = {}
  loadMap() {
    try {
      this.map = JSON.parse(readFileSync(this.config.mapFile, 'utf-8')) as Record<string, string>;
    } catch {
      this.map = {};
    }
  }
  async runCareful(dirPath: string, containSubDir = true) {
    const files = await readdir(dirPath);
    const names: string[] = [];
    const states: Record<string, Stats> = {};
    for (const name of files) {
      const path = resolve(dirPath, name);
      if (this.config.exclude.test(path)) continue;
      const state = await stat(path);
      if (state.isFile() && this.config.include.test(path)) {
        names.push(path);
        states[path] = state;
      } else if (state.isDirectory() && containSubDir) {
        this.run(path);
      }
    };
    const list: { path: string, contents: Buffer }[] = [];
    // 检测是否可以跳过该文件夹
    const stats = Object.values(states);
    const max = Math.max(...stats.map(s => s.mtimeMs));
    const outFileShould = this.map[names[0]];
    const outFilePath = resolve(this.config.out, outFileShould + '.png');
    let exist: boolean;
    try {
      await access(outFilePath);
      exist = true;
    } catch {
      exist = false;
    }
    if (exist) {
      const s = await stat(outFilePath);
      if (s.mtimeMs > max) {
        console.log(`The dir ${dirPath} has no change,so I skipped it!`);
        return;
      };
    }

    const outName = uuid();
    for (const path of names) {
      const result = {
        path,
        contents: await readFile(path)
      };
      list.push(result);
      this.map[path] = outName;
    };
    const result = await packAsync(list, Object.assign(this.config, {
      textureName: outName
    }));
    for (const { name, buffer } of result) {
      await writeFile(resolve(this.config.out, name), buffer);
    }
    console.log(`create packed texture ${outName} for ${names.join(', ')}`);
    this.writeMap();
  }
  async run(dirPath: string, containSubDir = true) {
    const files = await readdir(dirPath);
    const names: string[] = [];
    for (const name of files) {
      const path = resolve(dirPath, name);
      if (this.config.exclude.test(path)) continue;
      const state = await stat(path);
      if (state.isFile() && this.config.include.test(path)) {
        names.push(path);
      } else if (state.isDirectory() && containSubDir) {
        this.run(path);
      }
    };
    const list: { path: string, contents: Buffer }[] = [];
    const outName = uuid();
    for (const path of names) {
      const result = {
        path,
        contents: await readFile(path)
      };
      list.push(result);
      this.map[path] = outName;
    };
    const result = await packAsync(list, Object.assign(this.config, {
      textureName: outName
    }));
    for (const { name, buffer } of result) {
      await writeFile(resolve(this.config.out, name), buffer);
    }
    console.log(`create packed texture ${outName} for ${names.join(', ')}`);
    this.writeMap();
  }
}