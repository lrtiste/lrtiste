const pug = require('pug');
const rollup = require('rollup').rollup;
const fs = require('fs');
const path = require('path')
const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const prism = require('prismjs');

const highlighter = {
  loadContent(file){
    return fs.readFileSync(path.join(this.root, file));
  },
};

function prismHighlighter (language, root) {
  const instance = {
    highlight(file){
      const content = this.loadContent(file);
      return this.prism.highlight(content.toString(), this.prism.languages[language]);
    }
  };
  Object.defineProperty(instance, 'root', {value: root});
  return instance;
}

const cssHighlighter = function (prism, root) {
  return Object.create(Object.assign(prismHighlighter('css', root), highlighter), {prism: {value: prism}});
};

const jsHighlighter = function (prism, root) {
  return Object.create(Object.assign(prismHighlighter('javascript', root), highlighter), {prism: {value: prism}});
};

const markupHighlighter = function (prism, root) {
  const instance = Object.create(Object.assign(prismHighlighter('markup', root), highlighter), {prism: {value: prism}});

  const load = instance.loadContent.bind(instance);
  instance.loadContent = function (file) {
    return pug.render(load(file), {pretty: true});
  };
  return instance;
};

function highlight (root) {
  return function (fileName) {
    const [fn, extension] = fileName.split('.');
    switch (extension) {
      case 'css':
        return cssHighlighter(prism, root).highlight(fileName);
      case 'js':
        return jsHighlighter(prism, root).highlight(fileName);
      case 'pug':
        return markupHighlighter(prism, root).highlight(fileName);
      default:
        throw new Error('unsupported language');
    }
  }
}

const files = fs.readdirSync(path.join(process.cwd(), '/doc/components/'));

for (const f of files.filter(file=>file.split('.').length === 1)) {
  const writeStream = fs.createWriteStream(path.join(process.cwd(), '/dist/doc/components/', [f, 'html'].join('.')));
  const html = pug.renderFile(path.join(process.cwd(), `/doc/components/${f}/`, [f, 'pug'].join('.')), {
    title: `${f} component`,
    highlight: highlight(path.join(process.cwd(), `/doc/components/${f}/samples/`))
  });

  writeStream.write(html);

  rollup({
    entry: path.join(process.cwd(), `/doc/components/${f}/samples/`, 'index.js'),
    plugins: [node(), commonjs()],
  }).then(function (bundle) {
    return bundle.write({
      format: 'iife',
      dest: path.join(process.cwd(), '/dist/doc/components/', [f, 'js'].join('.'))
    });
  })
    .catch(err=> {
      console.log(err);
      process.exit(1);
    });
}