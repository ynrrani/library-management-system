import {initBooksList} from '@/api'
import Vue from 'vue'
const state = {
   booksList:[],
}

const actions = {
    initBooksList({commit}){
        initBooksList().then(res=>{
            console.log(res);
            
            if(res.status == 200)
                commit('INITBOOKSLIST',res.data)
        },err=>console.log(err.message))
    }
}

const mutations = {
  
    INITBOOKSLIST(state,data){
        state.booksList = data
    }


}

const getters = {

}

export default {
    state,
    actions,
    mutations,
    getters
}