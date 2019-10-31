/**
 * ParseTransform
 * @param {object} transform
 * @retun
 */
export default function parse(transform){

  if (!transform) return undefined

  let result = {}

  for (let i in transform = transform.match(/(\w+)\(([^,)]+),?([^)]+)?\)/gi)) {
    let res = transform[i].match(/[\w\.\-]+/g)
    result[res.shift()] = res
  }

  return result
}
