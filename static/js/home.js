new Vue({
  el: "#app",
  data: {
    password: "",
    hasError: false,
    devices: [],
    newDeviceName: "",
    modalVisible: {
      newDevice: false
    }
  },
  methods: {
    logout: function(event) {
      axios
        .post("../../api/logout")
        .then(res => {
          window.location.href = "/dash/login";
        })
        .catch(err => {
          console.error(err);
        });
    },
    removeDevice: function(event) {
      const deviceId =
        event.srcElement.parentNode.parentNode.firstChild.innerHTML;

      axios
        .post("../../api/device/delete", {
          name: deviceId
        })
        .then(res => {
          this.devices = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    },
    createDevice: function(event) {
      console.log(this.newDeviceName);

      axios
        .post("../../api/device/new", {
          name: this.newDeviceName
        })
        .then(res => {
          this.devices = res.data;
        })
        .catch(err => {
          console.error(err);
        });

      this.modalVisible.newDevice = false;
    }
  },
  mounted() {
    axios
      .get("../../api/device/list")
      .then(res => {
        this.devices = res.data;
      })
      .catch(err => {
        console.error(err);
      });
  }
});
