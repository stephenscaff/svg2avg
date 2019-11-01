/**
 * CopyAVG
 * Copy to clipboard interaction for our final AVG JSON
 * @author stephen scsff
 */

const CopyAVG = (() => {

  const btn = document.querySelector('.js-copy-btn')
  const avgCode = document.querySelector('.js-copy-avg')

  return {

    init() {
      this.bindEvents()
    },

    bindEvents(){

      btn.addEventListener('click', () => {
        CopyAVG.copyToClipboard(avgCode)
      })
    },

    /**
     * GetPalette
     * @param {item} color
     */
    copyToClipboard(avgCode) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(avgCode)
      selection.removeAllRanges()
      selection.addRange(range)

      try {
        document.execCommand('copy')
        selection.removeAllRanges()
        CopyAVG.btnState(btn, 'Copied!', 'is-success')
      }
      catch(e) {
        CopyAVG.btnState(btn, 'Failed!', 'is-error')
      }
    },

    /**
     * Btn State
     * Manages updating btn elements message, text and class name
     * based on success or error state.
     * @param {HTMLElment} btnEl
     * @param {string} message - button's text
     * @pram {string} btnClass - buttons' state class
     *
     */
    btnState(btnEl, message, btnStateClass ) {
      const original = btnEl.textContent
      btnEl.textContent = message
      btnEl.classList.add(btnStateClass)

      setTimeout(() => {
        btnEl.textContent = original
        btnEl.classList.remove(btnStateClass)
      }, 1200)
    }
  }
})()

export default CopyAVG
