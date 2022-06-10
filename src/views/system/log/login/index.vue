<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="登录账号" prop="loginName">
        <el-input v-model.trim="queryParams.loginName" placeholder="请输入登录账号" clearable @keyup.enter.native="searchList"/>
      </el-form-item>
      <el-form-item label="登录IP地址" prop="ipAddr" label-width="90px">
        <el-input v-model.trim="queryParams.ipAddr" placeholder="请输入登录IP地址" clearable @keyup.enter.native="searchList"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="登录状态" clearable>
          <el-option v-for="dict in dict.type.sys_common_status" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="访问时间" prop="accessTimeSearchDate">
        <el-date-picker clearable v-model="queryParams.accessTimeSearchDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择访问时间"
                        :editable="false" style="width: 180px">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleBatchDelete"
                   v-has-permi="['system-login-log-delete']">
          删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="searchList"></right-toolbar>
    </el-row>

    <el-table :data="logList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="登录账号" align="center" prop="loginName"/>
      <el-table-column label="IP地址" align="center" prop="ipAddr"/>
      <el-table-column label="IP归属地" align="center" prop="ipLocation"/>
      <el-table-column label="登录状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_common_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="提示信息" align="center" prop="msg" width="120" :show-overflow-tooltip="true"/>
      <el-table-column label="登录时间" align="center" prop="accessTime" width="180"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-has-permi="['system-login-log-delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
  </div>
</template>

<script>
  import {deleleLogById, deleleLogByIds, logPage} from "../../../../api/system/log/login-log";

  export default {
    name: "LoginLog",
    dicts: ['sys_common_status'],
    data() {
      return {
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 登录日志记录表格数据
        logList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          loginName: null,
          ipAddr: null,
          status: null,
          accessTimeSearchDate: null
        }
      }
    },
    created() {
      this.searchList();
    },
    methods: {
      searchList() {
        this.queryParams.pageNum = 1;
        this.queryParams.pageSize = 10;
        this.getList();
      },
      getList() {
        logPage(this.queryParams).then(response => {
          this.logList = response.data.data;
          this.total = response.data.total;
        });
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.$resetForm(this.queryParams);
        this.searchList();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
        this.single = selection.length !== 1;
        this.multiple = !selection.length
      },
      /** 单个删除 */
      handleDelete(row) {
        this.$modal.confirm('确定删除？', '提示').then(() => {
          deleleLogById(row.id).then(() => {
            this.searchList();
          });
        });
      },
      /** 批量删除 */
      handleBatchDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('确定删除？', '提示').then(() => {
          deleleLogByIds(ids).then(() => {
            this.searchList();
          });
        });
      }
    }
  };
</script>
