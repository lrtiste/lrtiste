const pug = require('pug');
const rollup = require('rollup').rollup;
const fs = require('fs');
const path = require('path')
const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const prism = require('prismjs');

const highlighter = {
  loadContent(file){
    return fs.readFileSync(path.join(process.cwd(), '/doc/components/tabs/samples/', file));
  },
};

function prismHighlighter (language) {
  return {
    highlight(file){
      const content = this.loadContent(file);
      return this.prism.highlight(content.toString(), this.prism.languages[language]);
    }
  }
}

const cssHighlighter = function (prism) {
  return Object.create(Object.assign({}, highlighter, prismHighlighter('css')), {prism: {value: prism}});
};

const jsHighlighter = function (prism) {
  return Object.create(Object.assign({}, highlighter, prismHighlighter('javascript')), {prism: {value: prism}});
};

const markupHighlighter = function (prism) {
  return Object.create(Object.assign({loadContent(file){
    return pug.render(highlighter.loadContent(file),{pretty:true});
  }}, prismHighlighter('markup')), {prism: {value: prism}});
};


function highlight (fileName) {
  const [fn, extension] = fileName.split('.');
  switch (extension) {
    case 'css':
      return cssHighlighter(prism).highlight(fileName);
    case 'js':
      return jsHighlighter(prism).highlight(fileName);
    case 'pug':
      return markupHighlighter(prism).highlight(fileName);
    default:
      throw new Error('unsupported language');
  }
}

const writeStream = fs.createWriteStream(path.join(process.cwd(), '/dist/doc/components/', 'tabs.html'));
const html = pug.renderFile(path.join(process.cwd(), '/doc/components/tabs/', 'tabs.pug'), {
  title: 'tabs component',
  highlight
});

writeStream.write(html);

rollup({
  entry: path.join(process.cwd(), '/doc/components/tabs/samples/', 'index.js'),
  plugins: [node(), commonjs()],
}).then(function (bundle) {
  return bundle.write({
    format: 'iife',
    dest: path.join(process.cwd(), '/dist/doc/components/', 'tabs.js')
  });
})
  .catch(err=>{
    console.log(err);
    process.exit(1);
  });

