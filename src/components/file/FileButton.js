import File from './mixins/file'
import Button from '../buttons/Button'

export default {
  name:"file-button",

  mixins: [File,Button],

  methods: {
    click() {
      // for Chrome to finish its animation, Safari & FF ok.
      setTimeout(()=>this.$refs.input.click(),90)
      
      // this doesnt work :/
      // requestAnimationFrame(()=>this.$refs.input.click())
    }
  },
  computed: {
    classes () {
      let c = Button.computed.classes.call(this)
      c['file--input'] = true
      return c;
    }
  },
  render (h) {
    const { tag, data } = this.generateRouteLink()
    const children = []

    if (tag === 'button') {
      data.attrs.type = this.type
    }
    console.log(data)
    children.push(this.genContent(h))
    children.push(this.genInput())

    return h(tag, data, children)
  }
}