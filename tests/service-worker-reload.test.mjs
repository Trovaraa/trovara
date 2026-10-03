import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/lib/service-worker-reload.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } })
const { reloadOnWorkerUpdate } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)

function fixture(initialController) {
  const worker = new EventTarget()
  worker.controller = initialController
  let reloads = 0
  reloadOnWorkerUpdate(worker, () => { reloads += 1 })
  return {
    change(controller) {
      worker.controller = controller
      worker.dispatchEvent(new Event('controllerchange'))
    },
    reloads: () => reloads,
  }
}

test('first installation claims the current page without a redundant reload', () => {
  const f = fixture(null)
  f.change({ version: 1 })
  assert.equal(f.reloads(), 0)
})

test('a later update after first installation still reloads exactly once', () => {
  const f = fixture(null)
  f.change({ version: 1 })
  f.change({ version: 2 })
  f.change({ version: 3 })
  assert.equal(f.reloads(), 1)
})

test('an already controlled page reloads when the controller is replaced', () => {
  const f = fixture({ version: 1 })
  f.change({ version: 2 })
  assert.equal(f.reloads(), 1)
})

test('duplicate notifications do not reload the same controller', () => {
  const controller = { version: 1 }
  const f = fixture(controller)
  f.change(controller)
  assert.equal(f.reloads(), 0)
})

test('a transient missing controller preserves genuine update detection', () => {
  const f = fixture({ version: 1 })
  f.change(null)
  assert.equal(f.reloads(), 0)
  f.change({ version: 2 })
  assert.equal(f.reloads(), 1)
})
