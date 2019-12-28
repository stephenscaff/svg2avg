/**
 * Emojis Roator
 */
const EmojiRotator = (() => {
  const el = document.querySelector('.js-emoji')
  const emojis = ["😀", "😮",  "😬", "😁", "😐", "😑"]
  //const emojis = ["😐", "😑"]
  const time = 110

  setInterval(_=>{
    el.innerHTML =[
      ...emojis
    ][new Date%emojis.length]
  }, time)
})()

export default EmojiRotator
