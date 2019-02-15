new Vue({
  el: '#app',
  data: {
    password: '',
    hasError: false,
    devices: []
  },
  methods: {
    logout: function(event){
      axios.post("../../api/logout")
      .then(res => {
        window.location.href = "/dash/login"
      })
      .catch(err => {
        console.error(err)
      });
    },
    removeDevice: function(event){
      const deviceId = event.srcElement.parentNode.parentNode.firstChild.innerHTML;

      axios.post("../../api/device/delete", {
        name: deviceId
      })
      .then(res => {
        this.devices = res.data
      })
      .catch(err => {
        console.error(err)
      });
    }
  },
  mounted() {
    axios.get("../../api/device/list")
    .then(res => {
      this.devices = res.data
    })
    .catch(err => {
      console.error(err)
    });
  },
});
