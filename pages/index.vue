<template>
  <client-only>
    <div ref="loading" class="navigation">
      <template v-if="pages.length !== 0">
        <input
          ref="searchInput"
          :value="searchQuery"
          name="search"
          type="text"
          class="search"
          placeholder="Search"
          autofocus="true"
          autocomplete="off"
          @input="onChange"
        />
        <div class="body">
          <div class="pages-folder">Pages</div>
          <template v-if="hasResults">
            <nuxt-link
              v-for="page in filteredPages"
              :key="page.id"
              :to="'/' + page.id"
              class="page-link"
            >
              {{ page.title }}
            </nuxt-link>
          </template>
        </div>
      </template>
    </div>
  </client-only>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      pages: []
    }
  },

  computed: {
    hasResults() {
      return this.filteredPages.length > 0
    },
    filteredPages() {
      return this.pages.filter((p) =>
        p.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyDown)
  },

  mounted() {
    document.addEventListener('keydown', this.onKeyDown)
    this.getPages()
  },

  updated() {
    if (this.$refs.searchInput) {
      this.$refs.searchInput.focus()
    }
  },

  methods: {
    async getPages() {
      const loading = this.$vs.loading({
        target: this.$refs.loading,
        type: 'square',
        color: '#0c77f8'
      })
      const pages = await fetch(
        'https://cors-anywhere.herokuapp.com/https://prisma-vercel.ignatif.now.sh/api/pages',
        {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          }
        }
      ).then((r) => {
        return r.json()
      })
      loading.close()
      this.pages = pages
    },

    onKeyDown(e) {
      const { key, metaKey } = e

      if (key === 'Enter') {
        const page = this.filteredPages[0]

        if (page) {
          this.$router.push(`/${page.id}`)
        }
      }

      if (key === 'Escape') {
        this.$router.back()
      }

      if (metaKey && key === 'o') {
        e.preventDefault()
        this.$router.back()
      }
    },

    onChange({ target }) {
      this.searchQuery = target.value
    }
  },
  head() {
    return {
      title: 'Pages'
    }
  }
}
</script>

<style lang="scss">
.navigation {
  position: relative;
  display: flex;
  padding-top: 140px;
  padding-bottom: 22px;
  padding-left: 0px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
  background-image: none;
  background-position: 0px 0px;
  -webkit-filter: none;
  filter: none;
}

.search {
  width: 655px;
  height: 52px;
  margin-bottom: 40px;
  padding: 0px;
  border: none;
  background-color: transparent;
  color: #000;
  font-size: 42px;
  line-height: 46px;
  font-weight: 700;
  outline: none;
}

.search::placeholder {
  color: rgba(1, 23, 49, 0.36);
}

.body {
  width: 655px;
  display: flex;
  flex-direction: column;
}

.page-link {
  color: #0c77f8;
  font-size: 18px;
  line-height: 30px;
  font-weight: 500;
  padding: 10px 0px;
}

.pages-folder {
  display: flex;
  margin-right: 0px;
  margin-bottom: 0px;
  padding: 5px 13px 5px 0px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  order: -1;
  border-style: none none solid;
  border-width: 1px 1px 2px 3px;
  border-color: rgba(0, 0, 0, 0.09) rgba(0, 0, 0, 0.09) rgba(0, 0, 0, 0.09)
    hsla(0, 0%, 46.7%, 0.07);
  font-weight: 600;
  padding-right: 7px;
  padding-left: 0px;
  font-size: 18px;
  line-height: 30px;
  white-space: normal;
}
</style>
