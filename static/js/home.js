new Vue({
	el: "#app",
	data: {
		devices: [],
		regionals: [],
		newDeviceName: "",
		newRegionalName: "",
		newRegionalLoading: false,
		modalVisible: {
			newDevice: false,
			newRegional: false,
		},
		errors: {
			newDevice: {
				generic: false,
				nameTaken: false
			},
			newRegional: {
				alreadyLoaded: false,
				noRegionalExists: false,
				generic: false,
			}
		}
	},
	methods: {
		logout: function(event) {
			axios
				.post("../../api/logout")
				.then(() => {
					window.location.href = "/dash/login";
				})
				.catch(err => {
					console.error(err);
				});
		},
		removeDevice: function(event) {
			const deviceId = event.srcElement.parentNode.parentNode.firstChild.innerHTML;

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
		},
		createRegional: function(event) {
			this.newRegionalLoading = true;

			for (let i in this.errors.newRegional) {
				this.errors.newRegional[i] = false;
			}

			axios
				.post("../../api/regional/new", {
					key: this.newRegionalName
				})
				.then(res => {
					this.newRegionalLoading = false;
					this.regionals = res.data;
					this.modalVisible.newRegional = false;
					this.newRegionalName = "";

					for (let i in this.errors.newRegional) {
						this.errors.newRegional[i] = false;
					}
				})
				.catch(err => {
					this.newRegionalLoading = false;
					if (err.status === 409) {
						this.errors.newRegional.alreadyLoaded = true;
					} else if(err.status === 404) {
						this.errors.newRegional.noRegionalExists = true;
					} else {
						this.errors.newRegional.generic = true;
					}

					console.error(err);
				});
		},
		removeRegional: function(event) {
			const regionalKey = event.srcElement.parentNode.parentNode.children[1].innerHTML;

			axios
				.post("../../api/regional/delete", {
					key: regionalKey
				})
				.then(res => {
					this.regionals = res.data;
				})
				.catch(err => {
					console.error(err);
				});
		},
		primeRegional: function(event) {
			const regionalKey = event.srcElement.parentNode.parentNode.children[1].innerHTML;

			axios
				.post("../../api/regional/active", {
					key: regionalKey
				})
				.then(res => {
					this.regionals = res.data;
				})
				.catch(err => {
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

		axios
			.get("../../api/regional/list")
			.then(res => {
				this.regionals = res.data;
			})
			.catch(err => {
				console.error(err);
			});
	}
});
