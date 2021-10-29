import { resolve } from 'path';
import { Packer } from "../packages/img-packer";
/**
 * 开发阶段，使用原图，
 *
 * 生产模式，图片->雪碧图->压缩纹理
 */
new Packer({
  in: resolve(__dirname, '../examples/public/img'),
  out: resolve(__dirname, '../examples/public/tex'),
  mapFile: resolve(__dirname, '../examples/public/map.json'),
  watch: false,
  exclude: /re\./,
  include: /\.png$/
});
