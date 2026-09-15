# BLACKLINE COLLISION

Premium cinematic landing page concept for an American collision repair business. Built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, React Three Fiber, Drei, Three.js and GSAP ScrollTrigger.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Business contact details, verified reviews, certifications, map data and the form endpoint are centralized in `src/config.ts`. Empty values are intentionally not presented as real business claims. Configure `formEndpoint` to activate multipart estimate requests and photo delivery.

Generated workshop photography is stored in `public/images/workshop/` and used for the editorial service, technology and final-inspection compositions.

## 3D vehicle attribution

The locally bundled `public/models/mustang-gt.glb` is **2005 Ford Mustang GT** by [Ricy on Sketchfab](https://sketchfab.com/3d-models/2005-ford-mustang-gt-26b6b60cf2804370ac3c64424242dc1f), used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The original attribution notice is preserved beside the model in `public/models/MUSTANG-LICENSE.md`. BLACKLINE COLLISION is a demonstration project and is not affiliated with or endorsed by Ford Motor Company.
