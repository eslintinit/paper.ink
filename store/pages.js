export const state = () => []

export const mutations = {
  getPages: (state) =>
    fetch(
      'https://cors-anywhere.herokuapp.com/https://prisma-vercel.ignatif.now.sh/api/pages',
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json'
          // 'X-Requested-With': 'XMLHttpRequest'
        }
      }
    )
      .then((r) => r.json())
      .then((pages) => {
        console.log('receive')
        state = pages
        console.log(state)
      }),

  getPage(state, id) {
    fetch(
      `https://cors-anywhere.herokuapp.com/https://prisma-vercel.ignatif.now.sh/api/pages/${id}`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      }
    ).then((r) => console.log(r))
  }
}

export const getters = {
  pages: (state) => state.pages,
  page: (state) => (id) => {
    const r = state.pages.find((p) => p.id === id)
    return r
  }
}
