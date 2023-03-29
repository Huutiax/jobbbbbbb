import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userNumber: "",
    isProbationaryStaff: true // 试用期员工
  },
  mutations: {
    setUserNumber(state, number) {
      state.userNumber = number;
    },
    setIsProbationaryStaff(state, bol) {
      state.isProbationaryStaff = bol;
    }
  },
  actions: {}
});
