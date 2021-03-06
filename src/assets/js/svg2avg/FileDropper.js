import template from './template.js'
import JSZip from 'jszip'
import saveAs from 'file-saver';


/**
 * FileDropper
 * Handles file drop events
 */
const FileDropper = (() => {

  const fileDrop  = document.querySelector('.js-file-dropper')
  const viewer    = document.querySelector('#js-viewer')
  const html      = document.querySelector('html')
  let zip         = new JSZip()
  let count       = 0;

  return {

    /**
     * Init
     * @example FileDropper.init()
     */
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
        const files   = dropEvent.dataTransfer.items
        let numFiles  = files.length;

        [...files].map(child => {
          let file     = child.getAsFile()
          let fileName = file.name.split('.')[0] + '.avg';
          let reader   = new FileReader()
          let isSVG    = FileDropper.validateSVG(file.type)

          // Error and bail if not svg.
          if (isSVG) {
            FileDropper.success(el, numFiles)
          } else {
            FileDropper.error(el)
            return
          }

          reader.onload = function(e) {
            let svgData = reader.result
            FileDropper.convertor(svgData, fileName, numFiles)
          }

          reader.readAsText(file)

        }).filter(child => !!child)
      }
    },

    /**
     * Converter
     * Handles the SVG to AVG conversion
     * @requires template.js
     */
    convertor(data, filename, numFiles) {
      let frag = FileDropper.createFrag(data).querySelector('svg')

      viewer.innerHTML = ""

      template(frag).then(json => {
        const avgJson = JSON.stringify(json, null, 4)

        if (numFiles === 1) {
          FileDropper.writeToViewer(avgJson)
        } else {
          FileDropper.createZip(avgJson, filename, numFiles)
        }
      })
    },


    /**
     * Write To Editor
     * Outputs AVG JSON to our code viewer
     * @param {string} - string of avg json
     */
    writeToViewer(avgJsonStr){
      viewer.insertAdjacentHTML('beforeend', avgJsonStr)
    },


    /**
     * Create Zip
     * @param {string} avgJsonStr - avg json as string
     * @param {string} fileName
     * @param {int} numFiles
     * @requires JSZip, saveAs
     */
    createZip(avgJsonStr, fileName, numFiles){
      let blob = new Blob([avgJsonStr], {type: 'application/svg+xml'})

      zip.folder('avgs').file(fileName, blob, {
        binary: true
      })

      ++count

      if (count == numFiles) {
         zip
         .generateAsync({
           type:'blob'
         })
         .then(function(content) {
            saveAs(content, 'avgs.zip');
         })
      }
    }
  }
})()

export default FileDropper
