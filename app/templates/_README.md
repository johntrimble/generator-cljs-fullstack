# <%= appname %>

## Requirements
* [Node.js]() (>=0.10.26)
* [Grunt](http://gruntjs.com/getting-started) (>=4.2)
* [Compass](http://compass-style.org/install/) (>=0.12.2) 
* [Leiningen](http://leiningen.org/#install) (>=2.3.2)

## Running in Development
From the project root, execute the following:

```
grunt serve
```

This will:

* Compile ClojureScript source
* Compile Sass source
* Start a node server running backend code at [http://localhost:4000](http://localhost:4000)
* Start a static content server at [http://localhost:9000](http://localhost:9000)
	* Proxies `http://localhost:9000/api/` to `http://localhost:4000/api`
	* Live reloads the browser on content changes (updating ClojureScript code, HTML, CSS, etc.)

Assuming there are no errors, this task should automagically open up a browser window to [http://localhost:9000](http://localhost:9000).

If you'd like to have your tests run continuously in the background as well, use the `--with-tests` options:

```
grunt serve --with-tests
```

	
## Generating a Distribution
From the project root, execute the following:

```
grunt
```

This will:

* Compile ClojureScript server source
* Compile ClojureScript client source with advanced mode
* Compile Sass source
* Concatenate and minify JavaScript source
* Minify HTML source
* Put all backend assets under `dist`
* Put all frontend assets under the `dist/public` directory
* Generate a suitable `package.json` at `dist/package.json`

Assuming there are no errors, the `dist` directory will be a self contained distribution of the application. The application can be started by running the following:

```
cd dist
npm install
npm start
```

## Running Tests
From the project root, execute the following:

```
grunt test
```

This will:

* Compile ClojureScript source for the backend and frontend
* Run the backend and frontend tests

Note: This effectively runs `lien cljsbuild once` twice, once for the backend and once for the frontend. This means it's slow. If you plan on running tests continuously, you may want to look at running in develop


