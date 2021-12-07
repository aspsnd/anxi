import { Loader, NetFileLoadType } from "@anxi/loader";
export default async () => {

  const loader = new Loader();
  console.log(loader.progress)
  loader.add({
    name: 'asp',
    files: {
      a: {
        url: '/img/3.png',
        loadType: NetFileLoadType.Image
      }
    }
  });
  await loader.load();
  console.log(loader.progress);
}