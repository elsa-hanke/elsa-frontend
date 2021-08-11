import axios from 'axios'

export async function getKoejaksot() {
  const path = 'vastuuhenkilo/koejaksot'
  return await axios.get(path)
}
