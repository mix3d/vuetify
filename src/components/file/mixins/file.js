export default {
  data () {
    return {
        files: [],
    }
  },
  props: {
    multiple: Boolean,
    accept:[Array,String], //accept="file_extension|audio/*|video/*|image/*|media_type"
    name: String,
  },
  watch: {
    files (files) {
      console.log("files changed:",files)
      this.$emit('selected',files)//this is an array of FileList objects
    },
  },
  computed: {
    isDirty() { return this.files.length },
    selectedItems() {
      return Array.from(this.files).map(f => f.name)
    }
  },
  methods: {
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
            click: e => (e.stopPropagation(),console.log("clicked"))
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
  }
}