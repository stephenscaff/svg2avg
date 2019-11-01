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
  avgJson.width  = parseInt(el.getAttribute('width') || '100', 10);
  avgJson.height = parseInt(el.getAttribute('height') || '100', 10);
  avgJson.items  = buildItems(el.children);

  return avgJson;
}
