# Golden harness

Proves a refactor changed no geometry, rather than hoping it didn't.

`makeTires`, `makeWheels` and `calculateWheelPosition` are pure — fitment numbers
in, `THREE.Object3D` out, no React and no WebGL context — so they can be run
headless and compared float for float. The harness builds every corner of a
spread of fitments, hashes the resulting world-space vertices, and checks the
hashes against `goldens.json`.

## Using it

```
npm test                  # check current geometry against the goldens
npm run golden:capture    # rewrite goldens.json from current geometry
```

Before a refactor, run the tests and confirm they pass. Refactor. Run them
again. Anything red moved.

Only run `golden:capture` when a change is *meant* to alter geometry — it
overwrites the very thing the tests compare against, so capturing to make a
failure go away destroys the evidence. Commit the regenerated file on its own so
the diff is reviewable.

## What is covered

- **96 corners** — six fitment cases × four chassis × four corners. The cases
  reach both signs of rim delta, an asymmetric front/rear pair, and settings that
  drive the carcass clamps to their stops.
- **4 bounce traces** — 600 steps at 1/60s across the spring-rate range.
- **2 suspension sweeps** — hub-to-fender and camber over the full ride-height
  range, front and rear.

Cases cover both axles deliberately. Most paired settings are equal front to
rear, so a harness that only checked the front would pass an axle-sourcing bug
that silently fed front values to the rear wheels.

## Precision

Vertices are rounded to nine decimals before hashing. Transcendental functions
are not bit-identical across platforms or V8 versions, and nine decimals sits far
below any change a refactor can cause — a vertex moving 1e-9 feet is a third of a
nanometre — while staying far above that noise.

## What is not covered

`.glb` wheel designs need a network fetch, so only the built-in procedural wheel
is captured. Every design is fitted into the same envelope by the same code path,
so the fitter is exercised; the models themselves are not.
