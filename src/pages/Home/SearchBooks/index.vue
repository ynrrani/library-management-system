<template>
  <div>
    <el-input
      placeholder="请输入您要搜索的书名/作者"
      prefix-icon="el-icon-search"
      @keyup.enter.native="searchBook"
      @blur="clear"
      v-model="name"
    >
    </el-input>
    <el-table
      :data="flag == 0 ? booksList : searchBooks"
      height="450"
      style="width: 100%"
      v-loading.fullscreen.lock="loading"
      element-loading-text="正在处理..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="图书名称：">
              <span>{{ props.row.bookName }}</span>
            </el-form-item>
            <el-form-item label="图书作者：">
              <span>{{ props.row.author }}</span>
            </el-form-item>
            <el-form-item label="书籍位置：">
              <span>{{ props.row.position }}</span>
            </el-form-item>
            <el-form-item label="当前库存：">
              <span>{{ props.row.amount }}</span>
            </el-form-item>
            <el-form-item label="总库存："
              >&nbsp;&nbsp;
              <span>{{ props.row.totalAmount }}</span>
            </el-form-item>
            <el-form-item label="借阅次数：">
              <span>{{ props.row.borrowedTimes }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="图书名称" sortable prop="bookName">
      </el-table-column>
      <el-table-column sortable label="图书作者" prop="author">
      </el-table-column>
      <el-table-column sortable label="书籍位置" prop="position">
      </el-table-column>
      <el-table-column sortable label="当前库存" prop="amount">
      </el-table-column>
      <el-table-column label="操作" v-if="!isAdmin">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="bookReserve(scope.$index, scope.row)"
            >预约</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { addReserve, initReserve, searchBook } from "@/api";
import axios from "axios";
import qs from "qs";
export default {
  name: "SearchBooks",
  data() {
    return {
      loading: false,
      name: "",
      flag: 0,
      borrowInfo: {
        borrowDate: "",
        realDate: "",
      },
      searchBooks: [],
    };
  },
  methods: {
    bookReserve(index, row) {
      this.loading = true;
      console.log(index, row);
      let readerId = this.readerId;
      let bookId = row.bookId;
      let date = this.$moment().format("YYYY-MM-DD HH:mm:ss");
      let reserveObj = { readerId, bookId, date, status: "已预约" };
      console.log(reserveObj);
      //  添加预约记录
      addReserve(qs.stringify(reserveObj)).then(
        (res) => {
          this.loading = false;
          console.log(res);
          if (res.status == 0) {
            this.$message({
              showClose: true,
              message: res.msg,
              type: "error",
            });
          } else if (res.status == 200) {
            this.$message({
              showClose: true,
              message: res.msg,
              type: "success",
            });
          }

          this.$store.dispatch("initReserve", { readerId: this.readerId });
        },
        (err) => {
          this.loading = false;
          console.log(err.message);
        }
      );
    },
    searchBook(e) {
      this.loading = true;
      searchBook(qs.stringify({ name: this.name })).then(
        (res) => {
          this.loading = false;
          e.target.blur();
          this.flag = 1;
          this.searchBooks = res.data;
          console.log(res);
          if (res.status == 0) {
            this.$message({
              showClose: true,
              message: "未找到相关书籍！",
              type: "error",
            });
          }
        },
        (err) => {
          this.loading = false;
          console.log(err.message);
        }
      );
    },
    clear() {
      this.flag = 0;
      this.searchBooks = [];
    },
  },
  computed: {
    ...mapState({
      booksList(state) {
        return state.Books.booksList;
      },
      readerId(state) {
        return state.User.readerInfo.readerId;
      },
      isAdmin(state) {
        return state.User.isAdmin;
      },
    }),
  },
  mounted() {
    // this.$store.dispatch('initBooksList')
    console.log(this.searchBooks);
  },
};
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>