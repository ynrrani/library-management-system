<template>
    <el-table
    :data="auditList"
    style="width: 100%"
         v-loading.fullscreen.lock="loading"
    element-loading-text="正在处理..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
     <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left"  class="demo-table-expand">
          <el-form-item label="内容:">&nbsp;
            <span style="color: #409EFF;">{{ props.row.content }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="日期"
      >
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column>
     <el-table-column
      label="书名"
     >
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>姓名: {{ scope.row.bookName }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.bookName }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      label="姓名"
      >
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>姓名: {{ scope.row.readerName }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.readerName }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
   
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">批准</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {mapState} from 'vuex'
import {auditComment} from '@/api'
import qs from 'qs';
export default {
    name: 'IndexIndex',

    data() {
        return {
            loading:false
        };
    },
  computed:{
        ...mapState({
        commentsList(state){
            return state.Comments.commentsList
        }
        }),
        auditList(){
          return this.commentsList.filter((item)=>{
           return item.status == 0
          })
        }
    },
    methods:{
        handleDelete(index,row){
          this.loading = true
            console.log(row);
            let infoObj = {readerId:row.readerId,bookId:row.bookId,date:row.date}
            auditComment(qs.stringify(infoObj)).then(res=>{
            this.loading = false
                this.$message({
                       showClose: true,
                       message: '批准成功！',
                       type: 'success',
                   });
                console.log(res);
            },err=>{
            this.loading = false
                console.log(err.message);
            })
          this.$store.dispatch('initCommentsList')

        }
    }
};
</script>

<style lang="scss" scoped>

</style>