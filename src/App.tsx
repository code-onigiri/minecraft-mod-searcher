import { createSignal } from 'solid-js'

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <div class="min-h-screen flex items-center justify-center p-6">
      <div class="card w-full max-w-md shadow-xl">
        <div class="card-body items-center text-center">
          <h2 class="card-title">Minecraft Mod Searcher</h2>
          <p class="text-sm opacity-70">Starter with <strong>Tailwind</strong> + <strong>daisyUI</strong></p>
          <div class="card-actions">
            <button class="btn btn-primary" onClick={() => setCount((c) => c + 1)}>Count: {count()}</button>
            <a class="btn btn-ghost" href="https://github.com/code-onigiri/minecraft-mod-searcher">Repository</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
