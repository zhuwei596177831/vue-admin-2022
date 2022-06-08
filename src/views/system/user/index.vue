<template>
  <div class="app-container">
    <!--搜索条件-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="用户名称" prop="name">
        <el-input v-model.trim="queryParams.name" placeholder="请输入用户名称" clearable @keyup.enter.native="searchList"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--工具栏-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-has-permi="['user-add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="searchList"></right-toolbar>
    </el-row>
    <!--列表-->
    <el-table :data="roleList" row-key="id" :cell-style="{textAlign: 'center'}" :header-cell-style="{textAlign:'center'}">
      <el-table-column prop="loginName" label="登录名"></el-table-column>
      <el-table-column prop="roleNames" label="角色"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"/>
      <el-table-column prop="address" label="住址"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row)" v-has-permi="['user-update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-has-permi="['user-delete']">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-key" @click="handleResetPwd(scope.row)" v-has-permi="['user-reset-pwd']">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <Pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="form" :model="form" :rules="rules" :inline="true" label-width="100px">
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model.trim="form.loginName" placeholder="请输入登录名" clearable/>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="form.roleIds" clearable multiple placeholder="请选择角色">
            <el-option v-for="item of roles" :label="item.name" :value="item.id" :key="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入姓名" clearable/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" clearable placeholder="请选择性别">
            <el-option v-for="(item,index) of sexs" :label="item" :value="item" :key="index"/>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" clearable/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="form.email" placeholder="请输入邮箱" clearable/>
        </el-form-item>
        <el-form-item label="住址" prop="address">
          <el-input v-model.trim="form.address" placeholder="请输入住址" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addUser, updateUser, userList, deleteUser, resetUserPwd} from '../../../api/system/user'
  import {findAllRoles} from '../../../api/system/role'
  import {hasIllegalChar, isEmail, isPhone} from '../../../utils/validate'
  import {mapGetters} from 'vuex'

  export default {
    name: "User",
    data() {
      const illegalChar = (rule, value, callback) => {
        if (hasIllegalChar(value)) {
          callback(new Error("含有非法字符"));
        } else {
          callback();
        }
      };
      const checkPhone = (rule, value, callback) => {
        if (isPhone(value)) {
          callback();
        } else {
          callback(new Error("手机号格式不正确"));
        }
      };
      const checkEmail = (rule, value, callback) => {
        if (value === null || value === '' || isEmail(value)) {
          callback();
        } else {
          callback(new Error("邮箱格式不正确"));
        }
      };
      return {
        total: 0,
        showSearch: true,
        roleList: [],
        title: "",
        sexs: ['男', '女'],
        open: false,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null
        },
        form: {
          id: null,
          loginName: null,
          roleIds: [],
          name: null,
          sex: null,
          phone: null,
          email: null,
          address: null
        },
        roles: [],
        rules: {
          loginName: [
            {required: true, message: '请输入登录名'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符'},
            {validator: illegalChar}
          ],
          roleIds: [
            {required: true, message: '请选择角色', trigger: 'change'}
          ],
          name: [
            {required: true, message: '请输入姓名'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符'},
            {validator: illegalChar}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'change'}
          ],
          phone: [
            {required: true, message: '请输入手机号'},
            {validator: checkPhone}
          ],
          email: [
            {min: 1, max: 30, message: '长度在 1 到 30 个字符'},
            {validator: checkEmail}
          ],
          address: [
            {min: 1, max: 100, message: '长度在 1 到 100 个字符'},
            {validator: illegalChar}
          ]
        }
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
        userList(this.queryParams).then(result => {
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
        this.title = '新增用户';
        this.findAllRoles();
      },
      handleUpdate(row) {
        this.$resetForm(this.form);
        this.open = true;
        this.title = '修改用户';
        this.form.id = row.id;
        this.form.loginName = row.loginName;
        this.form.roleIds = row.roleIds;
        this.form.name = row.name;
        this.form.sex = row.sex;
        this.form.phone = row.phone;
        this.form.email = row.email;
        this.form.address = row.address;
        this.findAllRoles();
      },
      findAllRoles() {
        findAllRoles().then(result => {
          this.roles = result.data;
        });
      },
      submitForm: function () {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id) {
              updateUser(this.form).then(result => {
                this.open = false;
                this.searchList();
              })
            } else {
              addUser(this.form).then(result => {
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
          deleteUser(row.id).then(() => {
            this.searchList();
          });
        });
      },
      handleResetPwd(row) {
        this.$prompt('请输入"' + row.name + '"的新密码', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          inputValidator: (password) => {
            if (!password) {
              return "请输入密码";
            }
            let pwd = password.replaceAll(" ", "");
            if (!pwd) {
              return "请输入密码";
            }
            if (password.includes(" ")) {
              return "密码不可包含空格";
            }
            return true;
          }
        }).then(({value}) => {
          resetUserPwd(row.id, value).then(response => {
            this.$modal.msgSuccess("修改成功，新密码是：" + value);
            this.searchList();
          });
        });
      },
    }
  };
</script>

<style lang="scss" scoped>

</style>

