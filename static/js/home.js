new Vue({
  el: '#app',
  data: {
    password: '',
    hasError: false,
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
    }
  }
});
