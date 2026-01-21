import { render } from 'solid-js/web';
import App from '../src/App';

test('renders title', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  render(() => <App />, container);
  expect(container.textContent).toMatch(/Minecraft Mod Searcher/i);
});
