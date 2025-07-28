# BTS Ticketing App

Production URL: https://bus-to-show.github.io/bus-to-show-react/

## Development

### Prerequisites

* Node v16.20
* npm v8.19

### Setup/run

1. Install the dependencies with `npm install`

2. Run the app with `npm start`

3. Ensure the API is listening on http://localhost:3000/ and browse to
   http://localhost:4200/bus-to-show-react/

### Test

Run the unit tests with `npm test`.

### Build/serve/deploy

Create a production build with `npm run build`.

The resulting build directory can be served on localhost with `npx serve -p 4200 build`.

The build directory can also be deployed to production, but this step is unnecessary as any
push/merge to the main branch will do so automatically via GitHub Actions.

The production build is hosted on GitHub Pages and loaded into an iframe on the BTS homepage.
To test the homepage integration:

1. Run the app with `npm start`

2. Still in the project root directory, start another server with `npx serve -p 7777`

3. Browse to http://localhost:7777/iframe-test.html

The app should load in the iframe and the iframe should resize to fit.

### References

* [Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
  * Also see [Advanced Configuration](https://create-react-app.dev/docs/advanced-configuration/)
* [Deployment](https://create-react-app.dev/docs/deployment/)
