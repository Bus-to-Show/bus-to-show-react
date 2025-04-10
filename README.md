# BTS Ticketing App

Production URLs:

* https://bustoshow.org/tickets/
* https://cosmic-kataifi-559176.netlify.app/tickets/

Netlify dashboard: https://app.netlify.com/sites/cosmic-kataifi-559176/

## Development

### Prerequisites

* Node v16.20
* npm v8.19

### Setup/run

1. Install the dependencies with `npm install`

2. Run the site with `npm start`

3. Ensure the API is listening on http://localhost:3000/ and browse to
   http://localhost:4200/tickets/

### Test

Run the unit tests with `npm test`.

### Build/serve/deploy

Create a production build with `npm run build`.

The resulting build directory can be served on localhost with `npx run serve -s build -l 4200`.

The build directory can also be deployed to production, but this step is unnecessary as any
push/merge to the main branch will do so automatically via GitHub Actions.

After deploying, the page hosting the app must be updated with the new JS/CSS file URLs as
described below.

### BTS Homepage integration

The production build is served by GitHub Pages at https://bus-to-show.github.io/bus-to-show-react/.

The bundled JS and CSS files are then injected into the page at https://bustoshow.org/tickets/.
These file names change with every deployment and have to be updated manually (for now).

You can see the new file names in the build log, e.g.:

```
$ npm run build

> bus-to-show@0.1.0 build
> react-scripts build

Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  154.21 kB (-12 B)  build/static/js/main.b4a3efa4.js
  2.14 kB            build/static/css/main.a8d72baf.css
```

You can also find the new file names by browsing the gh-pages branch, or by going to
https://bus-to-show.github.io/bus-to-show-react/ and inspecting the markup.

### Useful links

* [Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
  * Also see [Advanced Configuration](https://create-react-app.dev/docs/advanced-configuration/)
* [Deployment](https://create-react-app.dev/docs/deployment/)
