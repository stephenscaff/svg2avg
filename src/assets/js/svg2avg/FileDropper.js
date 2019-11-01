
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
     * DragOver
     * Handles drag over state
     * @param event
     */
    active(el) {
      el.classList.add('is-active')
      el.classList.remove('is-success')
      el.classList.remove('is-error')
      html.classList.remove('is-success')
      html.classList.remove('is-error')
    },

    /**
     * DragOver
     * Handles drag out state
     */
    deactive(el) {
      el.classList.remove('is-active')
    },

    /**
     * DragOver
     * Handles drag over state
     */
    success(el) {
      el.classList.add('is-success')
      el.classList.remove('is-active')
      el.classList.remove('is-error')
      html.classList.add('is-success')
      html.classList.remove('is-error')
    },

    /**
     * DragOver
     * Handles drag over state
     */
    error(el) {
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
     * readSVG
     * Read's SVG data via FileReader from drop event's dataTransfer.
     * @param {SVG element} el
     * @param {event} dropEvent
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/getAsFile
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileReader/FileReader
     */
    readSVG(el, dropEvent) {

      if (dropEvent.dataTransfer.items && dropEvent.dataTransfer.items.length && dropEvent.dataTransfer.items[0].kind === 'file'){
          let file = dropEvent.dataTransfer.items[0].getAsFile()
          let reader = new FileReader()
          let isSVG = FileDropper.validateSVG(file.type)

          // Error and bail if not svg.
          if (isSVG) {
            FileDropper.success(el)
          } else {
            FileDropper.error(el)
            return
          }

          reader.onload = function(e) {
            let svgData = reader.result
            FileDropper.write(svgData)
          }
        reader.readAsText(file)
      }
    },



    /**
     * Write
     * Created a docfrag for our svg data,
     * then calls SVG to AVG converion and outputs it
     * to our viewer view.
     * @param {object} SVG Data
     * @see converter.js
     */
    write(data) {

      let svgEl = FileDropper.createFrag(data).querySelector('svg')

      // Ensure viewer is cleared
      viewer.innerHTML = ""

      template(svgEl).then(json => {
        const svgJson = JSON.stringify(json, null, 4)
        viewer.insertAdjacentHTML('beforeend', svgJson);
      });
    }
  }
})()

export default FileDropper
