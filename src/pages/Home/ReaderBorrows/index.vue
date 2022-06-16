<template>
    <el-table
    :data="reserve"
    style="width: 100%"
    height="450"
    v-loading.fullscreen.lock="loading"
    element-loading-text="正在处理..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    >
     <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left"  class="demo-table-expand">
          <el-form-item label="预约日期：">
            <span>{{ props.row.date }}</span>
          </el-form-item>
          <el-form-item label="借书日期：" v-if="props.row.borrowDate!='9999-12-31 00:00:00'">
            <span>{{ props.row.borrowDate }}</span>
          </el-form-item>
          <el-form-item label="还书日期：" v-if="props.row.returnDate!='9999-12-31 00:00:00'">
            <span>{{ props.row.returnDate }}</span>
          </el-form-item>
          <el-form-item label="书籍名称：">
            <span>{{ props.row.bookName }}</span>
          </el-form-item>
          <el-form-item label="图书作者：">
            <span>{{ props.row.author }}</span>
          </el-form-item>
          <el-form-item label="图书状态：">
            <span>{{ props.row.status}}</span>
          </el-form-item>
        </el-form>
      </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="预约日期"
            >
          </el-table-column>
          <el-table-column
            prop="bookName"
            label="书籍名称"
            >
          </el-table-column>
          <el-table-column
            prop="author"
            label="图书作者"
            >
          </el-table-column>
          <el-table-column
            prop="status"
            label="图书状态"
            >
          </el-table-column>
        <el-table-column label="操作" width="200">
       <template slot-scope="scope">
        <el-button
          size="mini"
          type="warning"
          plain
          v-if="scope.row.status == '已预约'"
          @click="cancelReserve(scope.$index, scope.row)">取消预约 
          </el-button>      
        <el-button
          size="mini"
          :type="scope.row.status == '已预约' ? 'primary' : scope.row.status == '已借' ? 'success' : 'info'"
          plain
          :disabled="scope.row.status == '已还'"
          @click="changeStatus(scope.$index, scope.row)">{{scope.row.status == '已预约' ? '确认借书' : scope.row.status == '已借' ? '确认还书' : '已还'}}</el-button>    
           <el-button
          size="mini"
          type="warning"
          plain
          v-if="scope.row.status == '已借'"
          @click="mycontinue(scope.$index, scope.row)">续借 
          </el-button>     
    </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from "vuex";
import {
  deleteReserve,
  addBorrow,
  changeReserve,
  changeBorrow,
  continueBorrow
} from "@/api";
import qs from "qs";
export default {
  data() {
    return {
      loading: false
    };
  },
  name: "ReaderSubscribe",
  methods: {
    // 取消预约
    cancelReserve(index, row) {
      console.log(index, row);
      let bookId = row.bookId;
      let readerId = this.$store.state.User.readerInfo.readerId;
      let date = row.date;
      let obj = { bookId, readerId, date };
      console.log(obj);
      this.loading = true;
      deleteReserve(qs.stringify(obj)).then(
        res => {
          this.loading = false;
          console.log(res);
          if (res.status == 200) {
            this.$message({
              showClose: true,
              message: "取订成功！",
              type: "success"
            });
          }
          this.$store.dispatch("initReserve", { readerId: this.readerId });
        },
        err => {
          this.loading = false;
          console.log(err.message);
        }
      );
    },
    // 改变借阅状态
    changeStatus(index, row) {
      console.log(index, row);
      let readerId = this.readerId;
      let bookId = row.bookId;
      let date = row.date;

      this.loading = true;

      let borrowObj = { readerId, bookId, date };
      if (row.status == "已预约") {
        //  添加借书记录
        addBorrow(qs.stringify(borrowObj)).then(
          res => {
            this.loading = false;
            console.log(res);
            if (res.status == 0) {
              this.$message({
                showClose: true,
                message: res.msg,
                type: "error"
              });
            } else if (res.status == 200) {
              this.$message({
                showClose: true,
                message: "借书成功！",
                type: "success"
              });
            }
            // this.$store.dispatch("initBorrows", { readerId: this.readerId });
        this.$store.dispatch('initReserve',{readerId:this.readerId})

          },
          err => {
            this.loading = false;
            console.log(err.message);
          }
        );
        // 修改预约状态
        let infoObj = { readerId, bookId, date, status: "已借" };
        console.log(infoObj);
        changeReserve(qs.stringify(infoObj)).then(
          res => {
            console.log(res);
          },
          err => console.log(err.message)
        );
        this.$store.dispatch("initReserve", { readerId: this.readerId });
      } else if (row.status == "已借") {
        // 修改借书记录
        let borrowObj = { readerId, bookId, borrowDate: row.borrowDate, date };
        changeBorrow(qs.stringify(borrowObj)).then(
          res => {
            this.loading = false;
            console.log(res);
            if (res.status == 200) {
              this.$message({
                showClose: true,
                message: "还书成功！",
                type: "success"
              });
            }
            let infoObj = { readerId, bookId, date, status: "已还" };
            console.log(infoObj);
            changeReserve(qs.stringify(infoObj)).then(
              res => {
                console.log(res);
                this.$store.dispatch("initReserve", {
                  readerId: this.readerId
                });
              },
              err => console.log(err.message)
            );
          },
          err => {
            this.loading = false;
            console.log(err.message);
          }
        );
      }
    },
    // 续借
    mycontinue(index,row){
      console.log(row);
      this.loading = true
       let infoObj = {readerId:row.readerId,bookId:row.bookId,borrowDate:row.borrowDate,date:row.date}
       continueBorrow(qs.stringify(infoObj)).then(res=>{
      this.loading = false
        console.log(res);
        if(res.status == 200){
            this.$message({
                showClose: true,
                message: '续借成功！',
                type: 'success',
            });
        }
        this.$store.dispatch('initReserve',{readerId:this.readerId})
       })
    }
  },
  computed: {
    ...mapState({
      reserve(state) {
        return state.Reserve.reserve;
      },
      readerId(state) {
        return state.User.readerInfo.readerId;
      }
    })
  }
};
</script>

<style lang="less" scoped>
</style>