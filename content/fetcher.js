

import memes from "./memes.json"

export const getAllMemes = () => {

  return {
    data: memes,
    memeMap: memes.reduce((a, c, i) => {
      a[c.id] = c
      a[c.id].index = i
      return a
    }, {})
  }
}
