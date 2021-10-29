// @ts-ignore
const pages = import.meta.glob('../page/**') as Record<string, any>;

interface PageData {
  html?: boolean
  js?: boolean
}

const pageData: Record<string, PageData> = {}
for (const path of Object.keys(pages)) {
  const [_1, _2, exampleName, fileName] = path.split('/');
  if (!pageData[exampleName]) {
    pageData[exampleName] = {
      html: false,
      js: false,
    };
  }
  if (fileName === 'index.html') {
    pageData[exampleName].html = true;
  }
  if (fileName === 'index.ts') {
    pageData[exampleName].js = true;
  }
}
window.onhashchange = () => {
  location.reload();
}
var targetPage;
if (targetPage = Object.keys(pageData).find(pn => location.hash.replace('#', '') === pn)) {
  const canvas = document.createElement('canvas');
  canvas.id = 'appCanvas';
  document.body.appendChild(canvas);
  (async () => {
    let m = await pages[`../page/${targetPage}/index.ts`]();
    m.default();
  })()
} else {
  for (const [page, config] of Object.entries(pageData)) {
    let a = document.createElement('li');
    a.innerText = page;
    a.style.margin = '.5vw 5vw';
    document.body.appendChild(a);
    if (config.html) {
      a.onclick = () => {
        window.open(`./page/${page}/index.html`, '_self');
      }
    } else if (config.js) {
      a.onclick = () => {
        location.hash = page;
      }
    } else {
      a.onclick = () => {
        alert('找不到入口文件');
      }
    }
  }
}

