<template>
  <div class="page">
    <div class="content">
      <div v-html="page.content" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  async asyncData({ params: { page: id } }) {
    const page = await axios({
      method: 'get',
      url: `https://cors-anywhere.herokuapp.com/https://prisma-vercel-sand.now.sh/api/pages/${id}`,
      headers: { Origin: 'https://prisma-vercel-sand.now.sh' }
    })
      .then(({ data }) => {
        return data
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.log(error))
    return { page }
  },

  beforeRouteLeave(to, from, next) {
    document.removeEventListener('keydown', this.onKeyDown)
    next()
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.setOnEscapeListener()
    })
  },

  mounted() {
    /* const htmlElement = document.documentElement */
    /* htmlElement.setAttribute('theme', this.page.theme) */
  },

  methods: {
    onKeyDown(e) {
      if (this.$router.currentRoute.path !== '/') {
        const { key, metaKey } = e

        // On escape show all pages
        if (key === 'Escape') {
          this.$router.push('/')
        }

        // On "⌘ + o" show all pages
        if (metaKey && key === 'o') {
          e.preventDefault()
          this.$router.push('/')
        }
      }
    },

    setOnEscapeListener() {
      if (document) {
        document.addEventListener('keydown', this.onKeyDown)
      }
    }
  },

  head() {
    return {
      title: this.page.title !== '' ? this.page.title : 'antcmd.'
    }
  }
}
</script>

<style lang="scss">
.page {
  display: flex;
  justify-content: center;
}

.content {
  margin-top: 64px;
  width: 665px;
}
</style>
