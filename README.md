# BTS Ticketing App

Production URL: https://bus-to-show.github.io/bus-to-show-react/

Netlify dashboard: https://app.netlify.com/sites/cosmic-kataifi-559176/

## Development

### Prerequisites

* Node v16.20
* npm v8.19

### Setup/run

1. Install the dependencies with `npm install`

2. Run the site with `npm start`

3. Ensure the API is listening on http://localhost:3000/ and browse to
   http://localhost:4200/bus-to-show-react/

### Test

Run the unit tests with `npm test`.

### Build/serve/deploy

Create a production build with `npm run build`.

The resulting build directory can be served on localhost with `npx run serve -s build -l 4200`.

The build directory can also be deployed to production, but this step is unnecessary as any
push/merge to the main branch will do so automatically via GitHub Actions.

The production build is hosted on GitHub Pages and loaded into an iframe on the BTS homepage.

### Useful links

* [Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
  * Also see [Advanced Configuration](https://create-react-app.dev/docs/advanced-configuration/)
* [Deployment](https://create-react-app.dev/docs/deployment/)
