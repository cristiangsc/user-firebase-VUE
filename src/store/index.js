import Vue from 'vue'
import Vuex from 'vuex'
import {db} from '@/firebase/firebase.js'
import {collection, getDocs} from "firebase/firestore"
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users:[]
  },
  getters: {
  },
  mutations: {
    ADD_USER(state,users){
      state.users.push({
        id: users.id,
        rut: users.data().rut,
        name: users.data().name,
        lastname: users.data().lastname,
        city: users.data().city,
        email: users.data().email
      })
    },
    RESET_USER(state){
      state.users =[]
    }
  },
  actions: {
    async fetchUsers({commit}){
      let querySnapShot = await getDocs(collection(db,'users'))
      commit('RESET_USER')
      querySnapShot.forEach((doc)=>{
        commit('ADD_USER',doc)
        console.log(doc.id,'=>',doc.data())
      })
    }
  },
  modules: {
  }
})
