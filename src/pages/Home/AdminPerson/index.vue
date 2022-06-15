<template>
    <el-table
    :data="readerList"
    style="width: 100%"
    :default-sort = "{prop: 'readerName', order: 'descending'}"
    >
    <el-table-column
      prop="readerName"
      label="姓名"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="phone"
      sortable
      label="电话"
      >
    </el-table-column>
    <el-table-column
      prop="email"
      sortable
      label="邮箱"
      >
    </el-table-column>
    <el-table-column
      prop="borrowTimes"
      sortable
      label="借阅次数"
      >
    </el-table-column>
    <el-table-column
      prop="ovdTimes"
      sortable
      label="逾期次数"
      >
    </el-table-column>
  </el-table>
</template>

<script>
import {mapState} from 'vuex'
export default {
    name: 'AdminPerson',
    computed:{
        ...mapState({
             readerList(state){
                return state.User.readerList
            }
        })
    }
};
</script>

<style lang="less" scoped>

</style>