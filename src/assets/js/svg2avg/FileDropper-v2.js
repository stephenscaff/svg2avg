import writeFile from './writeFile.js'
import template from './template.js'


const FileDropper = (() => {
  const fileDrop = document.querySelector('.js-file-dropper')
  const viewer = document.querySelector('#js-viewer')
  const html = document.querySelector('html')

  return {

    init() {
      this.bindEvents()
    },

    /**
     * Bind Events
     * Handles event listeners that kick things off
     */
    bindEvents() {
      fileDrop.addEventListener('dragover', e => {
        e.preventDefault()
        e.stopPropagation()
        FileDropper.active(fileDrop)
      });

      fileDrop.addEventListener('dragleave', e => {
        e.preventDefault()
        e.stopPropagation()
        FileDropper.deactive(fileDrop)
      });

      fileDrop.addEventListener('drop', e => {
        e.preventDefault()
        e.stopPropagation()
        FileDropper.readSVG(fileDrop, e)
      });
    },

    /**
     * Active State
     * @param {HTML Elment}
     */
    active(el) {
      el.classList.add('is-active')
      el.classList.remove('is-success')
      el.classList.remove('is-error')
      html.classList.remove('is-success')
      html.classList.remove('is-error')
      html.classList.remove('is-success-multi')
    },

    /**
     * Deactive State
     * @param {HTML Elment}
     */
    deactive(el) {
      el.classList.remove('is-active')
    },

    /**
     * Success State
     * @param {HTML Elment}
     */
    success(el, numb) {
      el.classList.add('is-success')
      el.classList.remove('is-active')
      el.classList.remove('is-error')
      html.classList.add('is-success')
      html.classList.remove('is-error')

      if (numb > 1) {
        html.classList.add('is-success-multi')
      }
    },

    /**
     * Error State
     * @param {HTML Elment}
     */
    error(el) {
      html.classList.remove('is-success-multi')
      el.classList.remove('is-active')
      el.classList.remove('is-success')
      el.classList.add('is-error')
      html.classList.add('is-error')
      html.classList.remove('is-success')
    },


    /**
     * ValidateSVG
     * Determins if file is SVG;
     * @param {string} dataTransfer.items[0].getAsFile().type
     * @returns {boolean}
     */
    validateSVG(type) {
      if (type == 'image/svg+xml') {
        return true;
      } else {
        return false;
      }
    },

    /**
     * Create Fragment
     * Creates a document fragment from string of
     * html dom nodes without page reflow
     * @param {string} htmlStr
     */
    createFrag(htmlStr){
      let docFrag = document.createDocumentFragment()
      let fragDiv = document.createElement("div")

      fragDiv.innerHTML = htmlStr;
      docFrag.appendChild(fragDiv);

      return fragDiv
    },

    /**
     * Read SVG
     * Read's SVG data via FileReader from drop event's dataTransfer.
     * Calls write method after validation check.
     * @param {SVG element} el
     * @param {event} dropEvent
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/getAsFile
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileReader/FileReader
     */
    readSVG(el, dropEvent) {

      if (dropEvent.dataTransfer.items && dropEvent.dataTransfer.items[0].kind === 'file'){
          const files = dropEvent.dataTransfer.items;
          let numFiles = files.length;

          [...files].map(child => {
            let file = child.getAsFile()
            let filename = file.name.split('.')[0] + '.avg';
            let reader = new FileReader()
            let isSVG = FileDropper.validateSVG(file.type)

            // Error and bail if not svg.
            if (isSVG) {
              FileDropper.success(el, numFiles)
            } else {
              FileDropper.error(el)
              return
            }

            reader.onload = function(e) {
              let svgData = reader.result

              FileDropper.convertor(svgData, filename, numFiles)
            }
            reader.readAsText(file)

        }).filter(child => !!child)
      }
    },


    convertor(data, filename, numFiles) {
      let frag = FileDropper.createFrag(data).querySelector('svg')

      viewer.innerHTML = ""

      template(frag).then(json => {
        const avgJson = JSON.stringify(json, null, 4)
        if (numFiles === 1) {
          FileDropper.writeToEditor(avgJson)
        } else {
          FileDropper.createFile(avgJson, filename)
        }
      })
    },

    writeToEditor(avgJson){
      viewer.insertAdjacentHTML('beforeend', avgJson)
    },

    /**
     * Write
     * Inserts AVG Json to viewer after conversion
     * @param {object} SVG Data
     * @see converter.js
     */
    write(data, filename) {

      let svgEl = FileDropper.createFrag(data).querySelector('svg');

      // Ensure viewer is cleared
      viewer.innerHTML = ""

      // Convert and send back to dom
      template(svgEl).then(json => {
        const svgJson = JSON.stringify(json, null, 4)
        console.log('AVGs===', svgJson)

        FileDropper.createFile(svgJson, filename)
        //console.log('files', file)
        viewer.insertAdjacentHTML('beforeend', svgJson);
      });
    },


    createFile(avgData, filename){
      var blob = new Blob([avgData], {type: 'application/avg+xml'})

      if ( window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
      }
      else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }
    }
  }
})()

export default FileDropper
