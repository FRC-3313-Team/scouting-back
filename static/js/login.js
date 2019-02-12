new Vue({
  el: '#app',
  data: {
    password: '',
    hasError: false,
  },
  methods: {
    login: function(event){
      axios.post("../../api/login", {
        password: this.password,
      })
      .then(res => {
        this.hasError = false;

        window.location.href = "/dash/home"
      })
      .catch(err => {
        this.hasError = true;
      });
    }
  }
});
