// <label class="btn btn-default btn-file">
//     Browse <input type="file" style="display: none;">
// </label>



import Input from '../../mixins/input'

export default {
  name: 'file-select',

  mixins: [Input],
  
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
    multiple: Boolean,
    accept:[Array,String], //accept="file_extension|audio/*|video/*|image/*|media_type"
    name: String,

  },
  watch: {
    files (files) {
      console.log("files changed:",files)
      this.$emit('selected',files)
    },
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
    isDirty() { return this.files.length },
    selectedItems() {
      return Array.from(this.files).map(f => f.name)
    }
  },
  methods: {
    openFilePicker () {
      //lets the animation finish before opening, because the dialog pauses onscreen CSS animations for CHROME only. Safari/FF let the animation finish first on their own. 
      setTimeout(() => this.$refs.input.click(), 200)
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
        // props: { close: false },
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
      }, group)
      },
    genInput() {
      let attrs = { 
        type: 'file',
        name: this.name,
        multiple: this.multiple,
      }
      if(this.accept)
        attrs.accept = Array.isArray(this.accept) ? this.accept.join() : this.accept

      return this.$createElement('input', 
        {
          attrs,
          on: {
            change: (e) => {
              //Casting as array fixes Firefox bug where watched function doesn't fire
              this.files = Array.from(e.target.files || e.dataTransfer.files)
            },
            //prevent the parent from getting the click event
            click: e => e.stopPropagation()
          },
          ref: 'input',
          key: 'input'
        })
    },
    genInputWrapper() {
      return this.$createElement('label',
        {
          'class': 'file-input__wrapper',
        },
        [this.genInput()]
      ) 
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