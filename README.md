# Snowflake Maker

A plugin store for nx-svg-editor and rx-graphic-editor. Install **Snowflake Maker** from Extra Store, then choose **Snowflakes → Random snowflake** and click the canvas. Each insertion gets a fresh seed.

Select the snowflake to change its seed, shape (Surprise me, Stellar, Fern or Simple), branch levels, spread, line width, colour, centre and angle. **New snowflake** changes only the seed. Copy a seed to reproduce the same pattern with the same settings. **Edit…** opens a private preview; Apply saves one undo step and Cancel discards the draft. Moving, resizing, undo/redo and save/load follow the editor's normal workflow. Resizing keeps the crystal's proportions within its box.

The six arms share one mirrored, seeded branch geometry. Redraws never generate new randomness. SVG exports contain ordinary vector paths, and offline HTML exports retain the editable plugin. No external assets, network access or runtime dependencies.

Extra Store links this folder as `snowflake-maker/`; it can also be added as a standalone store using its `index.json`.

Run `npm test`, `npm run test:browser`, and `npm run lint`. `npm run gallery` regenerates the icon and store screenshot using the actual snowflake geometry.
