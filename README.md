# Starter boilerplate for Electron + Remix (Reactjs) + Vite + Typescript + Tailwindcss

- Typescript
- Vite
- Remix
- Reactjs
- Tailwindcss
- Electron
- Electron builder

# Why?

- It's just a simple boilerpate, but...
- As of the time writing this, I got trouble getting it up with Typescript. There is a problem with running `ts-node server.ts`, because its support for ESM is poor. I have to use `node --loader ts-node/esm ./server.ts`
- ESLint 9 with flat config has many problems with other eslint plugin documents. So must install ESLint 8.
- Struggled with converting `viteDevServer.ssrLoadModule() as ServerBuild`

# Steps to create this boilerplate

- Clone the boilerplate of Remix (mine)
  git clone git@github.com:cuongnx/bl-remix-react.git
- Our remix application the renderer by creating `src/renderer` folder and move the `root.tsx` there

### Install Tailwindcss

- Install tailwindcss following the docs https://tailwindcss.com/docs/guides/remix
  `npm i -D tailwindcss postcss autoprefixer`
- Make `tailwind.config.ts`, `global.css`, fix `root.tsx` to import `global.css`
- Try to run `npm run dev` to open dev server of remix app (Oh it works!!!)

### Install Electron

- Install electron
  `npm i -D electron electron-builder electron-serve electron-store`
- Struggled with making electron work with TS and vite, and this repo helped me much
  https://github.com/cawa-93/vite-electron-builder
- For development environment, tried using `electron -r ts-node/register .`, or `electron -r esbuild-register .` worked with electron v27, but with the current v32, it didn't work any more.
- Finally, it turned out that the current electron doesn't work directly with typescript, had to transpile to JS and run the program with the transpiled JS as the entrypoint. The process for development environment is like below
  - Use vite to build each component (main, prepload, renderer)
  - Run vitedevserver as the dev server for renderer (remix) (with vite as middleware to use HRM)
  - Build and run main server by using electron with the built JS main.js
- Separate scripts for running dev server and prod server
- Separete vite.config.ts for main and renderer. For renderer dev server, change setting in the dev script so that the `createServer()` reads renderer's vite config file.
- Running `npm run dev` and wow, it works!!!

### Note

- Because I realized that many things depend on node version, I installed semver and configure the `check-node-version.js` script.
