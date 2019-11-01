# SVG to AVG

### A simple App to convert SVG to AVG format for use in APL code.

APL stands for Alexa Presentation Language, which is Alexa's visual design framework for creating responsive interactive voice and visual experiences across mulimodal devices.

APL supports VectorGraphics in the `[Alexa Vector Graphic (AVG)](https://developer.amazon.com/docs/alexa-presentation-language/apl-avg-format.html)` format. AVG is a parameterized subset of Scalable Vector Graphics (SVG), organized into APL-friendly JSON.


Running this app will provide an interface to drop an SVG onto a file zone for conversion into AVG.


### Install

`npm i -D`


### Run

`gulp`

Running the project will compile the js and scss and start a server (s simple Express server via `gulp-live-server`) at [http://localhost:9000/](http://localhost:9000/).

- `src/views/index.html` will build to `dist/index.html`
- `src/assets/*` will build to `dist/assets/*`
- `src/assets/js/app.js` is the main js entry point.


### Process

The process works like this:
- A `drop` event listener triggers `event.dataTransfer.items` and the `FileReader` api to extract data from the svg (and validate the svg file type)
- The data is then written to an imaginary node object, using `createDocumentFragment()` to ready it for conversion.
- We then parse the available svg properties (`fill`, `fillOpacity`, `stroke`, etc) and convert it all into `AVG JSON`.
- Our final `AVG` data sent back to the browser using `JSON.stringify` and inserted into our code viewer.
- The user is also given a method to copy the final `AVG JSON` to clipboard using `window.getSelection()`,
and `document.createRange()` to get the content and `document.execCommand('copy')` to interface with the clipboard.




### Adding AVG to an APL Doc

In APL, AVG graphics are displayed within the `[VectorGraphic](https://developer.amazon.com/docs/alexa-presentation-language/apl-vectorgraphic.html)` component. The `VectorGraphic` component can load an AVG object from an APL package, APL document, or URL.

For the AVG to render in APL, you add the AVG JSON to the `graphics` property, wrapping it in a identifyin name for the AVG to reference in the `mainTemplate` property.

For example, the following AVG has the name `cubeGrid` within the APL doc/JSON, which is defined in the `graphics` property, and referenced in the `mainTemplate.items` to so it can actualy render.

_APL AVG Example_

```
// APL
{
    "type": "APL",
    "version": "1.2",
    "theme": "light",
    "graphics": {
        "cubeGrid": {
            "type": "AVG",
            "version": "1.0",
            "width": 512,
            "height": 512,
            "items": [
                {
                    "type": "path",
                    "pathData": "m63.5 191.5h256v256h-256z",
                    "fill": "#48caa6"
                },
                {
                    "type": "path",
                    "pathData": "m319.5 191.5h-256l128-128h256z",
                    "fill": "#a4e4d3"
                },
                {
                    "type": "path",
                    "pathData": "m447.5 319.5-128 128v-256l128-128z",
                    "fill": "#76d7bc"
                },
                {
                    "type": "path",
                    "pathData": "m503.5 0h-40c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5h32.5v32.5c0 4.142 3.358 7.5 7.5 7.5s7.5-3.358 7.5-7.5v-40c0-4.142-3.358-7.5-7.5-7.5z",
                    "fill": "#111"

                },
                {
                    "type": "path",
                    "pathData": "m47.5 0h-40c-4.142 0-7.5 3.358-7.5 7.5v40c0 4.142 3.358 7.5 7.5 7.5s7.5-3.358 7.5-7.5v-32.5h32.5c4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5z",
                    "fill": "#111"
                },
                {
                    "type": "path",
                    "pathData": "m503.5 456c-4.142 0-7.5 3.358-7.5 7.5v32.5h-32.5c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5h40c4.142 0 7.5-3.358 7.5-7.5v-40c0-4.142-3.358-7.5-7.5-7.5z",
                    "fill": "#111"
                },
                {
                    "type": "path",
                    "pathData": "m47.5 496h-32.5v-32.5c0-4.142-3.358-7.5-7.5-7.5s-7.5 3.358-7.5 7.5v40c0 4.142 3.358 7.5 7.5 7.5h40c4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5z",
                    "fill": "#111"
                },
                {
                    "type": "path",
                    "pathData": "m455 138.935c0-4.142-3.358-7.5-7.5-7.5s-7.5 3.358-7.5 7.5v49.459l-49 49v-106.788l49-49v22.894c0 4.142 3.358 7.5 7.5 7.5s7.5-3.358 7.5-7.5v-41c0-4.063-3.437-7.5-7.5-7.5h-256c-1.989 0-3.897.79-5.303 2.197l-127.999 127.998c-1.391 1.391-2.198 3.338-2.198 5.305v256c0 4.142 3.358 7.5 7.5 7.5h256c1.969 0 3.913-.806 5.305-2.198l127.999-127.999c1.407-1.406 2.197-3.314 2.197-5.303v-180.565zm-384 60.065h113v113h-113zm245.394-15h-106.788l49-49h106.787zm-117.394 15h113v113h-113zm113 128v113h-113v-113zm15-132.394 49-49v106.787l-49 49zm53.394-74.606h-106.788l49-49h106.787zm-185.788-49h106.787l-49 49h-106.787zm-64 64h106.787l-49 49h-106.787zm-59.606 192h113v113h-113zm256-4.394 49-49v106.787l-49 49zm64 42.788v-106.788l49-49v106.787z",
                    "fill": "#111"
                }
            ]
        }
    },
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
            "type": "VectorGraphic",
            "source": "cubeGrid",
            "width": 512,
            "height":512
            }
        ]
    }
}
```

### Notes

  - On the web, an SVG `path` will default to `fill` a value of `rgb(0,0,0)` (black) if none is provided. AVG however, does not. If a `fill` value is not specifically defined, the `path` will not render. As such, we might want the converter to provide a black `fill` value if none id provided?


### ToDos

- Cleanup SVGs with poor formatting, removing empty groups and so on.
- Maybe provide a download method, in addition to Copy to Clipboard?
- Maybe provide a viewer tab with APL-ready code (AVG named inside `graphics` property and referenced in `mainTemplate`)? But, can't count on svg having an id to base name on. Maybe use filename?
- The actual js could probably be more `pure` in nature.
