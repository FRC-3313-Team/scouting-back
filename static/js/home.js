new Vue({
  el: "#app",
  data: {
    password: "",
    hasError: false,
    devices: [],
    newDeviceName: "",
    modalVisible: {
      newDevice: false
    },
    errors: {
      newDevice: {
        generic: false,
        nameTaken: false
      }
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
          this.modalVisible.newDevice = false;
          this.newDeviceError = false;
          this.newDeviceName = "";

          for (let i in this.errors.newDevice) {
            this.errors.newDevice[i] = false;
          }
        })
        .catch(err => {
          if (err.status === 409) {
            this.errors.newDevice.nameTaken = true;
          } else {
            this.errors.newDevice.generic = true;
          }

          console.error(err);
        });
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
