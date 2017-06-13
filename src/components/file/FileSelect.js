// <label class="btn btn-default btn-file">
//     Browse <input type="file" style="display: none;">
// </label>



import Input from '../../mixins/input'
import File from './mixins/file'

export default {
  name: 'file-select',

  mixins: [Input,File],
  
  data () {
    return {
        isActive: false,
        files: [],
    }
  },

  props: {
    appendIcon: {
      type: String,
      default: 'arrow_drop_down'
    },
    chips: Boolean,
  },
  watch: {
    isActive (val) {
      if(val){
        this.focus()
      }
      else this.blur()
    }
  },
  computed: {
    classes () {
      return {
        'file--input': true,
        'input-group--text-field': true,
        'input-group--single-line': true,
        'input-group--select': true,
      }
    },
  },
  methods: {
    openFilePicker () {
      //lets the animation finish before opening, because the dialog pauses onscreen CSS animations for CHROME only. Safari/FF let the animation finish first on their own. 
      setTimeout(() => this.$refs.input.click(), 200)
      // this didn't work :/
      // requestAnimationFrame(() => this.$refs.input.click())
      this.isActive = true
    },
    blur () {
      this.$nextTick(() => (this.focused = false))
    },
    focus () {
      this.focused = true
    },
    genSelections () {
      const children = []
      const chips = this.chips
      const length = this.selectedItems.length

      this.selectedItems.forEach((item, i) => {
        if (chips) {
          children.push(this.genChipSelection(item))
        } else {
          children.push(this.genCommaSelection(item, i < length - 1))
        }
      })

      return children
    },
    genChipSelection (item) {
      return this.$createElement('v-chip', {
        'class': 'chip--select-multi',
        key: item
      }, item)
    },
    genCommaSelection (item, comma) {
      return this.$createElement('div', {
        'class': 'input-group__selections__comma',
        key: item
      }, `${item}${comma ? ', ' : ''}`)
    },
    genFileSelections () {
      const group = this.$createElement('transition-group', {
        props: {
          name: 'fade-transition'
        }
      }, this.isDirty ? this.genSelections() : [])

      return this.$createElement('div', {
        'class': 'input-group__selections',
        style: { 'overflow': 'hidden' },
      }, [group])
    },
    
  },
  render (h) {
    return this.genInputGroup([
      this.genFileSelections(),
      this.genInput()
    ], {
      ref: 'activator',
      directives: [{
        name: 'click-outside',
        value: () => (this.isActive = false)
      }],
      on: {
        // needed to let Chrome finish the animation before opening the picker
        click: e => this.openFilePicker(),
      }
    })
  }
}