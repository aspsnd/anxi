import { Loader, Resource, NetFileLoadType } from "@anxi/loader";
export default async () => {

  const loader = new Loader();

  const resource = await loader.loadResource(new Resource({
    name: 'asp',
    files: {
      a: {
        url: '/img/3.png',
        loadType: NetFileLoadType.Image
      }
    }
  }));
  console.log(resource.datas);
}