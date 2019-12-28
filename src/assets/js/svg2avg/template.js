import buildItems from './buildItems.js'

/**
 * Convert SVG Data to AVG JSON
 * @param {SVGElement} el - SVG to convert
 * @return {object} AVG JSON
 */
export default async function template(el) {

  const avgJson = {
    type: 'AVG',
    version: '1.0'
  }

  const viewBox = el.getAttribute('viewBox')
  const viewBoxArr = viewBox.split(' ', 4)

  avgJson.width  = parseInt(el.getAttribute('width') || viewBoxArr[2], 10)
  avgJson.height = parseInt(el.getAttribute('height') || viewBoxArr[3], 10)
  avgJson.items  = buildItems(el.children);

  return avgJson;
}
