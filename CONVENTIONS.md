# Conventions

How code in this repo is written. The goal is that any central function reads top-to-bottom
like a paragraph, and you only descend into a helper when you actually want the detail.

The reference implementation is [`src/assets/tire/index.ts`](src/assets/tire/index.ts).
When a rule below is unclear, go read `makeTires` and do that.

- [Functions](#functions) — §1–3
- [Naming and meaning](#naming-and-meaning) — §4–8
- [State and data flow](#state-and-data-flow) — §9–12
- [React](#react) — §13–15
- [Resources and files](#resources-and-files) — §16–18

---

# Functions

## §1 — A function is either a composition or a computation. Never both.

A *composition* names the steps of a process. Almost no arithmetic, no branching, no
literals — just calls to well-named things, in order:

```ts
export function makeTires(position, settings, model) {
    const { wheelDiameterIn, wheelWidthIn, tireWidthMm, tireSidewall } = axleSettings(position, settings);

    const rimRadiusIn = wheelDiameterIn / 2;
    const treadRadiusIn = Math.max(...);

    const carcass = mountCarcass(tireWidthMm, wheelWidthIn);
    const chain = solveTreadChain(carcass, rimRadiusIn, treadRadiusIn);

    const tire = new THREE.Mesh(
        new THREE.LatheGeometry(tireProfile(chain, rimRadiusIn), LATHE_SEGMENTS),
        makeTireMaterial(),
    );
    placeOnAxle(tire, position, settings, model);
    return tire;
}
```

You can read that and understand the whole tire pipeline without opening a single helper.
That is the bar.

A *computation* does one piece of real work and returns a value. It may be dense, because
it is small and its name says what it produces.

If a function has both a pipeline and arithmetic inline, split it: the arithmetic becomes a
named computation, the caller becomes a composition.

## §2 — Extract for a name, not for reuse

Pull a block into its own function the moment it *deserves a name* — even if called exactly
once, even if three lines. `placeOnAxle` is called once. `makeTireMaterial` is called once.
They exist so `makeTires` stays readable.

The question is never "will I reuse this?" It is **"does naming this remove a paragraph of
reading from the caller?"**

## §3 — What not to extract

§2 has a failure mode: a call graph so fine-grained that following it costs more than
reading the original. Guardrails:

- **A wrapper that adds only a hop is noise.** If the body is one call and the name is no
  shorter than that call, inline it.
- **Don't split a formula that is one idea.** `rollingDiameter` is arithmetic on three
  lines and stays one function; there is no `sidewallHeight` worth extracting from it.
- **Don't extract to hit a line count.** A 40-line composition of clearly named steps is
  fine. Length is a symptom, never the diagnosis.
- **Helpers taking 5+ parameters usually mean the split is in the wrong place.** Long
  parameter lists mean you cut across the grain of the data; cut somewhere else.

A function earns its name by *removing reading*. If it doesn't, it's a tax.

---

# Naming and meaning

## §4 — Names carry the meaning, not comments

- Full words. `wheelPosition`, not `wp`. `treadRadius`, not `tr`. `settings`, not `s`.
- Booleans read as assertions: `isRear`, `matchWheels`, `hasLoadedModel`.
- Functions returning a value are named for **what they return** (`rollingDiameter`,
  `axleSettings`, `hubToFenderAtRest`). Functions performing an effect are named for
  **what they do** (`placeOnAxle`, `disposeObject`, `mountCarcass`).
- No `data`, `info`, `helper`, `utils`, `handle`, `process`, `manager` as a whole name.
  `wheelPositionCalculator` is a file name; the export inside is `calculateWheelPosition`.

Line length is not a rule here. A 110-character line with clear names beats a wrapped one.

## §5 — Every quantity carries its unit in its name

This codebase mixes four units — Three.js scene feet, spec inches, offset millimetres, and
angles in both degrees and radians. The type system cannot tell them apart, so the name must.

| Unit | Suffix | Example |
|---|---|---|
| Inches | `In` | `wheelDiameterIn`, `hubToFenderIn` |
| Millimetres | `Mm` | `wheelOffsetMm`, `spacerMm` |
| Scene feet | `Ft` | `radiusFt`, `plateYFt` |
| Degrees | `Deg` | `camberDeg` |
| Radians | `Rad` | `camberRad` |
| Compound | spell it | `springRateLbIn` |

A quantity with no suffix is dimensionless (a ratio, a count, a fraction) or it is a bug.

**All conversions live in one module**, one function per direction, each named
`fromUnitToUnit`. No bare `/ 12`, no bare `25.4`, anywhere else. Today that number is
spelled four different ways in four files — including once as `RIDE_HEIGHT_DROP_SCALE`,
which is not a unit conversion at all and had to be documented with a five-line apology
after it was misnamed `MM_TO_INCHES`. That is exactly the failure this rule prevents.

Conversion at the boundary, not in the middle: convert once on the way in, do all the work
in one unit, convert on the way out for display.

## §6 — No human-readable text in code

Every string a person reads lives in the strings module and is referenced symbolically.
Components never contain literal prose.

```ts
// src/i18n/strings.ts
export const STRINGS = {
  settings: {
    title: "Settings",
    tabs: { alignment: "Alignment", wheels: "Wheels", tires: "Tires" },
  },
  suspension: {
    frontTitle: "Front Suspension",
    rearTitle: "Rear Suspension",
    rideHeight: "Ride Height",
    stockValue: "Stock ({value})",
  },
} as const;
```

```ts
// Wrong
<h2 className="text-lg font-semibold">Settings</h2>

// Right
<h2 className="text-lg font-semibold">{STRINGS.settings.title}</h2>
```

Use `t(template, values)` from the same module when a string needs interpolation:
`t(STRINGS.suspension.stockValue, { value: formatted })`. Never build display text by
concatenation at the call site.

**This applies to text, not to every string literal.** Three other kinds exist and are
handled differently:

| Kind | Example | Goes where |
|---|---|---|
| Text a human reads | `"Front Suspension"` | `STRINGS` (this rule) |
| Domain tag | `"FL"`, `"na"`, `"front"` | String-literal union type + const map (§7) |
| Identifier | storage keys, routes, `.glb` paths, DOM ids | Named constant near its use |
| Tailwind classes | `"rounded-xl bg-zinc-50"` | Not text — see §15 |

## §7 — Domain tags are typed unions, not loose strings

Values the code branches on are declared as a union type with a single const map of members:

```ts
export type Axle = "front" | "rear";
export const WHEEL_POSITIONS = ["FL", "BL", "BR", "FR"] as const;
export type WheelPosition = (typeof WHEEL_POSITIONS)[number];
```

The compiler then catches typos and non-exhaustive switches, which is the guarantee we
actually want. Iterate the const array — never re-type `["FL", "BL", "BR", "FR"]` inline,
as three places currently do.

## §8 — Never derive behaviour from display text

```ts
// Wrong. Renaming the heading changes the physics.
const isRear = title.toLowerCase().includes("rear");
```

Behaviour keys off a typed domain tag (§7), never off a string meant for humans. A label is
an output, not an input. §6 makes this structurally impossible — once the label comes from
`STRINGS`, there is no prose in the component left to inspect.

## §9 — Comments

Default to none. If a comment explains **what** code does, the code needs better names.

**The exception is real:** this is a geometry and physics codebase. A number like `1.02` or
`0.15` cannot be justified by a name — the name says what it *is*, not why it's *that
value*. That knowledge lives in tire specs and suspension measurements, not in the source.

```ts
// Real wheels measure ~1" over nominal across the flanges, so nudge these up if
// it reads small inside the tire.
const DIAMETER_FIT = 1.02;
```

| Comment explains | Verdict |
|---|---|
| What the code does | Delete it, rename things |
| Why a magic number has that value | **Keep** — attach it to a named constant |
| A non-obvious physical or domain constraint | **Keep** |
| A workaround, or why the obvious approach fails | **Keep** |
| A section header inside a long function (`// Front section`) | Delete — that's a function boundary you haven't drawn |

Every magic number becomes a `SCREAMING_CASE` constant at the top of its file. The why goes
above the constant once, not at every use site.

---

# State and data flow

## §10 — Fork on front/rear in exactly one place

`axleSettings(position, settings)` is the only place the front/rear split is unpacked. Every
consumer takes the whole slice:

```ts
const { camberDeg, toeDeg, rideHeight, wheelDiameterIn } = axleSettings(position, settings);
```

Never re-derive inline with `isRear ? settings.rearCamber : settings.frontCamber`. Adding a
paired setting must mean editing one file, not eight.

Generally: **when a mapping already exists, use it.** Don't hand-roll a parallel version of
a lookup that lives elsewhere in the repo.

## §11 — Components read the store they need

A component reads its own state from the store. It does not receive fifteen
`value`/`setValue` pairs from a parent that read them from the same store.

```ts
// Wrong — 18 props, all of which came from useFitmentStore two levels up
<WheelSettings frontWheelWidth={...} setFrontWheelWidth={...} ... />

// Right
const WheelSettings = () => {
  const frontWheelWidthIn = useFitmentStore((s) => s.settings.frontWheelWidthIn);
```

Props are for what a parent genuinely knows and the child cannot: which axle to render, a
variant, a callback the parent owns. Not for relaying global state.

Subscribe to the narrowest slice — `(s) => s.settings.frontWheelWidthIn`, not
`(s) => s.settings` — so a slider drag doesn't re-render the whole panel.

## §12 — Derive, don't store; and never sync state with an effect

Anything computable from existing state is computed at read time. It is never written back
into a store, and never copied into another state variable by an effect.

```ts
// Wrong — an effect whose only job is to copy state to other state
useEffect(() => {
  if (!matchWheels) return;
  updateSettings({ rearWheelWidth: settings.frontWheelWidth, ... });
}, [matchWheels, settings.frontWheelWidth, ...]);

// Right — derive at the point of use
const rearWheelWidthIn = matchWheels ? frontWheelWidthIn : settings.rearWheelWidthIn;
```

An effect that only reacts to a state change is a bug waiting to happen: it renders once
with stale values, triggers a second render, and adds a dependency array nobody maintains.

Stores hold what survives navigation or is read by two distant components. Everything else
is local state.

---

# React

## §13 — Effects synchronize with the outside world, nothing else

A `useEffect` is for something outside React: a subscription, a network fetch, a timer, an
imperative DOM or WebGL handle. Reacting to your own state is §12's job; responding to a
user action belongs in the event handler that caused it.

Every effect does one thing and its first line says what. If you need
`eslint-disable react-hooks/exhaustive-deps`, that is a design smell to fix, not a comment
to write — it usually means state should be read imperatively via `store.getState()` inside
a callback rather than captured in a closure.

## §14 — A custom hook has one concern

Hooks are named `useX` and own a single piece of behaviour. A hook running five effects is
five hooks. Prefer `useSceneLifecycle`, `useBounceAnimation`, `useCornerGeometry` over one
`useThreeScene` that does all of it.

## §15 — Memoize for a reason

`useCallback` and `useMemo` are not free and are not the default. Reach for them only when:

1. the value is in a dependency array, or
2. it is passed to a memoized child, or
3. the computation is genuinely expensive and measured.

Otherwise write the plain value. A `useCallback` guarding a one-line setter costs more than
it saves.

## §16 — Shared UI lives in `components/ui`

If a presentational piece is defined in more than one file it moves to `components/ui` and
gets imported — `Field` is currently defined three times. Same for repeated class strings: a
card style used in seven files is a component or an exported constant, not seven copies of a
Tailwind string.

Inputs that parse (numbers, offsets) belong in one shared component that owns the
string-state-plus-commit-on-valid-parse dance, rather than repeating it per field.

---

# Resources and files

## §17 — Whoever adds it, disposes it

Three.js objects are not garbage collected. Geometries, materials, textures and render
targets hold GPU memory until explicitly released.

- Every `scene.add` has a matching `remove` **and** `disposeObject` on the same owner.
- Rebuild paths remove and dispose **before** creating replacements, never after.
- Every `useEffect` that creates a renderer, controls, lights or a loop returns a cleanup
  that tears down all of it. StrictMode double-mounts in dev; a cleanup that misses one
  handle leaves two render loops running.
- Async work that can be superseded carries a request token, and discards its result if a
  newer request started while it was in flight. Fast model switching must not let a stale
  `.then()` attach to a disposed object.

## §18 — Files and layering

- One primary export per file, named to match the file. If the filename says `inchesToCm`
  and the export is `inchesToMm`, one of them is lying — fix it the day you notice.
- Colocate a helper in the file that uses it until a second caller appears, then move it to
  `common/` or `utils/`.
- Directory tells you the layer: `assets/` builds Three.js objects, `stores/` holds state,
  `services/` talks to the network, `utils/` is pure functions, `components/` renders,
  `i18n/` holds text. A file doing two layers' jobs is in the wrong place and should split.
- Inside a file, order is: imports → types → constants → helpers → primary export.

---

# What "done" looks like

1. The central function still reads as a list of named steps.
2. No number in a body without a named constant; every quantity carries its unit.
3. No prose in a component — text comes from `STRINGS`.
4. No comment explaining *what*.
5. Everything added to the scene is disposed on the path that removes it.
6. Nothing duplicated that was already solved elsewhere in the repo.
7. `npm run lint` clean, with no new disables.
