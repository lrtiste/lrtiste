import zora from 'zora';
import {tooltip} from '../../components/tooltips';

const factory = tooltip();

function createContent () {
  document.body = document.body || document.createElement('body');
  const contentString = `<div id="container">
      <a aria-describedby="tooltip" href="#"> some link</a>
      <p role="tooltip" id="tooltip">I am the tooltip</p>
    </div>`;
  document.body.innerHTML = contentString;
}

export default zora()
  .test('tooltip: hide by default', function* (t) {
    createContent();
    const tt = factory({el: document.getElementById('tooltip')});
    t.equal(document.getElementById('tooltip'),null);
  })
  .test('tooltip: show tooltip', function* (t) {
    createContent();
    const tt = factory({el: document.getElementById('tooltip')});
    t.equal(document.getElementById('tooltip'),null);
    tt.show();
    t.equal(document.getElementById('tooltip'), tt.el);
  })
  .test('tooltip hide tooltip', function * (t) {
    createContent();
    const tt = factory({el: document.getElementById('tooltip')});
    t.equal(document.getElementById('tooltip'),null);
    tt.show();
    t.equal(document.getElementById('tooltip'), tt.el);
    tt.hide();
    t.equal(document.getElementById('tooltip'), null);
  });
