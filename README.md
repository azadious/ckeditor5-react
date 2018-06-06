# CKEditor 5 Component for React

<p align=center>⚠⚠ ⚠⚠ ⚠⚠

<p align=center><strong>NOTE:</strong> This package is not yet published on npm. It's a developer's preview available only through GitHub.
	
<p align=center>See <a href="https://github.com/ckeditor/ckeditor5-react/issues/5">https://github.com/ckeditor/ckeditor5-react/issues/5</a> for more information.

## Using with ready to use CKEditor 5 builds

There are pre-build versions of CKEditor 5 that you can choose from:
* [CKEditor 5 classic editor build](https://www.npmjs.com/package/@ckeditor/ckeditor5-build-classic)
* [CKEditor 5 inline editor build](https://www.npmjs.com/package/@ckeditor/ckeditor5-build-inline)
* [CKEditor 5 balloon editor build](https://www.npmjs.com/package/@ckeditor/ckeditor5-build-balloon)

Install bindings and one of the builds:

```bash
npm install --save @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic
```

Use CKEditor component inside your project:

```jsx
import React, { Component } from 'react';
import './App.css';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';

class App extends Component {
	render() {
		return (
			<div className="App">
				<h2>CKEditor 5 using build-classic</h2>
				<CKEditor
					editor={ ClassicEditorBuild }
					data="<p>Hello from CKEditor 5</p>"
					onChange={ data => console.log( data ) }
				/>
			</div>
		);
	}
}

export default App;	
```

##### TODO: Even after adding CKEditor 5 build to the babel process it producess some errors in Create React App production:

```bash
41:13-31 "export 'default' (imported as 'ClassicEditorBuild') was not found in '@ckeditor/ckeditor5-build-classic/build/ckeditor'
```

Most probably it is related to minifying the code. CKEditor 5 Builds are minified by default and there is no need to minify it once again.

## Building custom editor together with your React project

This guide is assuming that you are using [Create React App CLI](https://github.com/facebook/create-react-app) as your 
boilerplate. If not please read more about webpack configuration [here](https://docs.ckeditor.com/ckeditor5/latest/framework/guides/quick-start.html#lets-start).

Install React CLI:

```bash
npm install -g create-react-app
```

Create your project using the CLI and go to the project's directory:

```bash
create-react-app ckeditor5-react-example && cd ckeditor5-react-example
```

Ejecting configuration is needed for custom webpack configuration to load inline SVG images. 
More information about ejecting can be found [here](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-run-eject).

```bash
npm run eject
```

We need to modify webpack configuration scripts to load CKEditor 5 SVG icons properly. After ejecting they are located at

```bash
<project_root>/config/webpack.config.dev.js
<project_root>/config/webpack.config.prod.js
```

### Changes that need to be made to both config files (`webpack.config.dev.js` and `webpack.config.prod.js`)

In both files, at the beginning import an object that creates a configuration for PostCSS:

```js
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );
```

Then add two new elements to exported object under `module.rules` array. These are SVG and CSS loaders only for CKEditor 5 code:

```js 
{
  test: /ckeditor5-[^/\\]+\/theme\/icons\/[^/\\]+\.svg$/,
  use: [ 'raw-loader' ]
},
{
  test: /ckeditor5-[^/\\]+\/theme\/.+\.css/,
  use: [
    {
      loader: 'style-loader',
      options: {
        singleton: true
      }
    },
    {
      loader: 'postcss-loader',
      options: styles.getPostCssConfig( {
        themeImporter: {
          themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
        },
        minify: true
      } )
    }
  ]
},
```

Exclude CSS files used by CKEditor 5 from project's CSS loader:

```js
{
  test: /\.css$/,
  exclude: /ckeditor5-[^/\\]+\/theme\/.+\.css/,
  // (...)
```

and exclude CKEditor 5 SVG and CSS files from `file-loader` because these files will be handled by the loaders added previously 
(usually the last item in `module.rules` array is the `file-loader`) so it looks like this:

```js
{
  loader: require.resolve('file-loader'),
  // Exclude `js` files to keep "css" loader working as it injects
  // it's runtime that would otherwise processed through "file" loader.
  // Also exclude `html` and `json` extensions so they get processed
  // by webpacks internal loaders.
  exclude: [
  	/\.(js|jsx|mjs)$/, 
  	/\.html$/, 
  	/\.json$/, 
  	/ckeditor5-[^/\\]+\/theme\/icons\/[^/\\]+\.svg$/,
  	/ckeditor5-[^/\\]+\/theme\/.+\.css/
  ],
  options: {
    name: 'static/media/[name].[hash:8].[ext]'
  }
}
```

Next, install `raw-loader` and CKEditor 5 dev-utils:

```bash 
npm install --save-dev raw-loader @ckeditor/ckeditor5-dev-utils
```

Install bindings, editor and plugins you need:

``` 
npm install --save \ 
	@ckeditor/ckeditor5-react \ 
	@ckeditor/ckeditor5-editor-classic \
	@ckeditor/ckeditor5-essentials \
	@ckeditor/ckeditor5-basic-styles \
	@ckeditor/ckeditor5-heading \
	@ckeditor/ckeditor5-paragraph
```

### Changes in `webpack.config.prod.js` only

CKEditor 5 files are not transpiled to ES5 by default. Add CKEditor 5 files to be processed by Babel:

```js
// Process JS with Babel.
{
  test: /\.(js|jsx|mjs)$/,
  include: [ 
    paths.appSrc,
    path.resolve( 'node_modules', '@ckeditor' )
  ],
  // (...)
```

### Use CKEditor component inside your project:

```js
import React, { Component } from 'react';
import './App.css';
import CKEditor from '@ckeditor/ckeditor5-react';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';


class App extends Component {
	render() {
		return (
			<div className="App">
				<h2>CKEditor 5 using custom build</h2>
				<CKEditor
					onChange={ data => console.log( data ) }
					config={ {
						plugins: [ Essentials, Paragraph, Bold, Italic, Heading ],
						toolbar: [ 'heading', '|', 'bold', 'italic', '|', 'undo', 'redo', ]
					} }
					editor={ ClassicEditor }
					data="<p>Hello from CKEditor 5</p>"
				/>
			</div>
		);
	}
}

export default App;
```
