<template>
  <div class="app-container">
    <!--搜索条件-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model.trim="queryParams.name" placeholder="请输入角色名称" clearable @keyup.enter.native="searchList"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--工具栏-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-has-permi="['role-add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="searchList"></right-toolbar>
    </el-row>
    <!--列表-->
    <el-table :data="roleList" row-key="id" :cell-style="{textAlign: 'center'}" :header-cell-style="{textAlign:'center'}">
      <el-table-column prop="code" label="角色编码"></el-table-column>
      <el-table-column prop="name" label="角色名称"></el-table-column>
      <el-table-column prop="inputTime" label="录入时间"></el-table-column>
      <el-table-column prop="inputUserName" label="录入用户"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间"></el-table-column>
      <el-table-column prop="updateUserName" label="修改用户"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row)" v-has-permi="['role-update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-has-permi="['role-delete']">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-s-custom" @click="permissionMenus(scope.row)" v-has-permi="['role-permission-menu']">授权
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <Pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色编码" prop="code">
          <el-input v-model.trim="form.code" placeholder="请输入角色编码" clearable/>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入角色名称" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!--分配数据权限-->
    <el-dialog title="分配数据权限" :visible.sync="treeVisible">
      <el-tree :data="roleMenuData" ref="roleMenuTree" node-key="id" :default-expand-all="true"
               :show-checkbox="true" :check-on-click-node="true" :expand-on-click-node="false"
               :default-checked-keys="defaultCheckedKeys" :highlight-current="true"
               style="max-height: 400px;overflow-x: hidden;overflow-y: auto;">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRoleMenuTree">取 消</el-button>
        <el-button type="primary" @click="treeDetermine">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {roleList, addRole, updateRole, deleteRole, getMenuTrees, permissionRoleMenus} from '../../../api/system/role'
  import {hasIllegalChar} from '../../../utils/validate'
  import {warning} from '../../../utils/message'
  import {mapGetters} from 'vuex'

  export default {
    name: "Role",
    data() {
      const illegalChar = (rule, value, callback) => {
        if (hasIllegalChar(value)) {
          callback(new Error("含有非法字符"));
        } else {
          callback();
        }
      };
      return {
        selectRoleCode: null,
        total: 0,
        showSearch: true,
        roleList: [],
        title: "",
        open: false,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null
        },
        form: {
          id: null,
          code: null,
          name: null
        },
        rules: {
          code: [
            {required: true, message: '请输入角色编码'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符'},
            {validator: illegalChar}
          ],
          name: [
            {required: true, message: '请输入角色名称'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符'},
            {validator: illegalChar}
          ]
        },
        treeVisible: false,
        roleMenuData: [],
        roleId: null,
        defaultCheckedKeys: []
      };
    },
    computed: {
      ...mapGetters([
        'roleCodes'
      ])
    },
    created() {
      this.searchList();
    },
    methods: {
      cancel() {
        this.open = false;
        this.$resetForm(this.form);
      },
      searchList() {
        this.queryParams.pageNum = 1;
        this.queryParams.pageSize = 10;
        this.getList();
      },
      getList() {
        roleList(this.queryParams).then(result => {
          this.roleList = result.data.data;
          this.total = result.data.total;
        })
      },
      resetQuery() {
        this.$resetForm(this.queryParams);
        this.searchList();
      },
      handleAdd() {
        this.$resetForm(this.form);
        this.open = true;
        this.title = '新增角色';
      },
      handleUpdate(row) {
        this.$resetForm(this.form);
        this.open = true;
        this.title = '修改角色';
        this.form.id = row.id;
        this.form.code = row.code;
        this.form.name = row.name;
      },
      submitForm: function () {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id) {
              updateRole(this.form).then(result => {
                this.open = false;
                this.searchList();
              })
            } else {
              addRole(this.form).then(result => {
                this.open = false;
                this.searchList();
              });
            }
          } else {
            return false;
          }
        });
      },
      handleDelete(row) {
        this.$confirm('确定删除？', '提示').then(() => {
          deleteRole(row.id).then(() => {
            this.searchList();
          });
        });
      },
      cancelRoleMenuTree() {
        this.treeVisible = false;
      },
      permissionMenus(row) {
        this.selectRoleCode = row.code;
        getMenuTrees().then(result => {
          this.treeVisible = true;
          this.roleMenuData = result.data;
          this.roleId = row.id;
          this.defaultCheckedKeys = row.checkedMenuIds;
        });
      },
      treeDetermine() {
        let checkedMenuIds = this.$refs['roleMenuTree'].getCheckedKeys();
        let halfCheckedKeys = this.$refs['roleMenuTree'].getHalfCheckedKeys();
        let menus = [...halfCheckedKeys, ...checkedMenuIds];
        if (checkedMenuIds.length === 0) {
          warning('请勾选菜单');
          return;
        }
        permissionRoleMenus({
          roleId: this.roleId,
          checkedMenuIds: checkedMenuIds,
          menus: menus
        }).then(() => {
          this.treeVisible = false;
          if (this.roleCodes.includes(this.selectRoleCode)) {
            window.location.reload();
          } else {
            this.searchList();
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>

