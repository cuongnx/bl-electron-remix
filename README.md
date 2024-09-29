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

(This is to install Tailwindcss following the docs https://tailwindcss.com/docs/guides/remix)

- Install tailwindcss
  `npm i -D tailwindcss postcss autoprefixer`
- Make `tailwind.config.ts`, `global.css`, fix `root.tsx` to import `global.css`
- Try to run `npm run dev` to open dev server of remix app (Oh it works!!!)
-

(This is to install Electron)

- Install electron
  `npm i -D electron electron-builder electron-serve electron-store`
