<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属模块" prop="title">
        <el-input v-model.trim="queryParams.title" placeholder="请输入模块标题" clearable @keyup.enter.native="searchList"
                  style="width: 200px"/>
      </el-form-item>
      <el-form-item label="操作人员" prop="opeName">
        <el-input v-model.trim="queryParams.opeName" placeholder="请输入操作人员" clearable @keyup.enter.native="searchList"
                  style="width: 200px"/>
      </el-form-item>
      <el-form-item label="业务类型" prop="businessType">
        <el-select v-model="queryParams.businessType" placeholder="操作类型" clearable style="width: 200px">
          <el-option v-for="dict in dict.type.sys_oper_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="操作来源" prop="operatorType">
        <el-select v-model="queryParams.operatorType" placeholder="操作类别" clearable style="width: 200px">
          <el-option v-for="dict in dict.type.sys_oper_source" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable style="width: 200px">
          <el-option v-for="dict in dict.type.sys_common_status" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间" prop="opeTimeSearchDate">
        <el-date-picker clearable v-model="queryParams.opeTimeSearchDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择操作时间"
                        :editable="false" style="width: 200px"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleBatchDelete"
                   v-has-permi="['system-opeLog-delete']">
          删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="searchList"></right-toolbar>
    </el-row>
    <el-table :data="opeLogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="所属模块" align="center" prop="title"/>
      <el-table-column label="业务类型" align="center" prop="businessType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_oper_type" :value="scope.row.businessType"/>
        </template>
      </el-table-column>
      <el-table-column label="操作来源" align="center" prop="operatorType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_oper_source" :value="scope.row.operatorType"/>
        </template>
      </el-table-column>
      <el-table-column label="操作人员" align="center" prop="opeName"/>
      <el-table-column label="请求URL" align="center" prop="opeUrl" width="180" :show-overflow-tooltip="true"/>
      <el-table-column label="IP地址" align="center" prop="opeIp"/>
      <el-table-column label="IP归属地" align="center" prop="opeLocation"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_common_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="提示信息" align="center" prop="errorMsg" width="120" :show-overflow-tooltip="true"/>
      <el-table-column label="操作时间" align="center" prop="opeTime" width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-has-permi="['system-opeLog-delete']">
            删除
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetail(scope.row)" v-hasPermi="['system-opeLog-detail']">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
    <!-- 操作日志详情 -->
    <el-dialog title="操作日志详情" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
            <el-form-item
              label="登录信息："
            >{{ form.opeName }} / {{ form.opeIp }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form.opeUrl }}</el-form-item>
            <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ form.opeParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ form.opeTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {deleleOpeLogById, deleleOpeLogByIds, opeLogPage} from "../../../../api/system/log/ope-log";

  export default {
    name: "OpeLog",
    dicts: ['sys_oper_type', 'sys_common_status', 'sys_oper_source'],
    data() {
      return {
        open: false,
        form: {},
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
        // 操作日志记录表格数据
        opeLogList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          title: null,
          opeName: null,
          businessType: null,
          operatorType: null,
          status: null,
          opeTimeSearchDate: null
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
        opeLogPage(this.queryParams).then(response => {
          this.opeLogList = response.data.data;
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
          deleleOpeLogById(row.id).then(() => {
            this.searchList();
          });
        });
      },
      /** 批量删除 */
      handleBatchDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('确定删除？', '提示').then(() => {
          deleleOpeLogByIds(ids).then(() => {
            this.searchList();
          });
        });
      },
      handleDetail(row) {
        this.open = true;
        this.form = row;
      },
      // 操作日志类型字典翻译
      typeFormat(row, column) {
        return this.selectDictLabel(this.dict.type.sys_oper_type, row.businessType);
      }
    }
  };
</script>
