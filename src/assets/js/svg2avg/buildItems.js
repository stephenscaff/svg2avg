import parseTransform from './parseTransform.js'

/**
 * Build AVG Items
 * @param {object} SVG child properties
 * @return {object | undefined}
 */
export default function buildItems(children){
  //let items = [].slice.call(children).map(child => {

  // Map over our svg items
  let items = [...children].map(child => {

    // Bail if not a group or path (no AVG support)
    if (child.tagName != 'g' && child.tagName != 'path') return null

    // parse trasforms
    let transform = parseTransform(child.getAttribute('transform') || (child.getAttribute('transform') != 'none' ? child.getAttribute('transform') : null))

    return {
      type:           child.tagName === 'g' ? 'group' : 'path',
      pathData:       child.getAttribute('d') || undefined,
      fill:           child.getAttribute('fill') ? child.getAttribute('fill') : undefined,
      fillOpacity:    child.getAttribute('fill-opacity') && child.getAttribute('fill-opacity') != '1' ? parseFloat(child.getAttribute('fill-opacity')) : undefined,
      stroke:         child.getAttribute('stroke') && child.getAttribute('stroke') != 'none' ? child.getAttribute('stroke') : undefined,
      strokeOpacity:  child.getAttribute('stroke-opacity') && child.getAttribute('stroke-opacity') != '1' ? parseFloat(child.getAttribute('stroke-opacity')) : undefined,
      strokeWidth:    child.getAttribute('stroke-width') && child.getAttribute('stroke-width') != '1px' ? parseInt(child.getAttribute('stroke-width')) : undefined,
      opacity:        child.getAttribute('opacity') && child.getAttribute('opacity') != '1' ? parseFloat(child.getAttribute('opacity')) : undefined,
      rotation:       transform && transform.rotate && transform.rotate[0] && parseInt(transform.rotate[0], 10),
      pivotX:         transform && transform.rotate && transform.rotate[1] && parseInt(transform.rotate[1], 10),
      pivotY:         transform && transform.rotate && transform.rotate[2] && parseInt(transform.rotate[2], 10),
      scaleX:         transform && transform.scale && transform.scale[0] && parseInt(transform.scale[0], 10),
      scaleY:         transform && transform.scale && transform.scale[1] && parseInt(transform.scale[1], 10),
      translateX:     transform && transform.translate && transform.translate[0] && parseInt(transform.translate[0], 10),
      translateY:     transform && transform.translate && transform.translate[1] && parseInt(transform.translate[1], 10),
      items:          child.children && buildItems(child.children)
    }
  }).filter(child => !!child)


  return items.length > 0 ? items : undefined
}
