<template>
  <div class="app-container">
    <!--搜索条件-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model.trim="queryParams.name" placeholder="请输入菜单名称" clearable @keyup.enter.native="searchList"/>
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-select v-model="queryParams.type" clearable placeholder="请选择菜单类型">
          <el-option v-for="item of menuTypeList" :label="item.desc" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--工具栏-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-has-permi="['menu-add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="searchList"></right-toolbar>
    </el-row>
    <!--列表-->
    <el-table v-if="refreshTable" :data="menuList" row-key="id" :default-expand-all="isExpandAll" :cell-style="{textAlign: 'center'}"
              :header-cell-style="{textAlign:'center'}" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="name" label="菜单名称"/>
      <el-table-column prop="code" label="权限编码" :show-overflow-tooltip="true" width="120"/>
      <el-table-column prop="path" label="路径" :show-overflow-tooltip="true" width="160"/>
      <el-table-column prop="typeName" label="菜单类型"/>
      <el-table-column prop="parentName" label="上级菜单"/>
      <el-table-column prop="icon" label="图标">
        <template slot-scope="scope" v-if="scope.row.iconClass">
          <i :class="scope.row.iconClass"/>
        </template>
      </el-table-column>
      <el-table-column prop="inputTime" label="创建时间"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-has-permi="['menu-update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-has-permi="['menu-delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" :inline="true" label-width="100px">
        <el-form-item label="权限编码" prop="code">
          <el-input v-model.trim="form.code" placeholder="请输入权限编码" clearable/>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入菜单名称" clearable/>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-select v-model="form.type" @change="typeChange" clearable placeholder="请选择菜单类型">
            <el-option v-for="item of menuTypeList" :label="item.desc" :value="item.value" :key="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId" v-if="parentMenuShow">
          <el-cascader v-model="form.parentId" :options="parentMenuList" :show-all-levels="false"
                       :props="{ checkStrictly: true,expandTrigger: 'hover',emitPath:false }"
                       clearable placeholder="请选择上级菜单" :key="cascaderkey"></el-cascader>
        </el-form-item>
        <el-form-item label="菜单路径" prop="path" v-if="buttonMenuShow">
          <el-input v-model.trim="form.path" placeholder="请输入菜单路径" clearable/>
        </el-form-item>
        <el-form-item label="菜单图标" prop="iconClass" v-if="buttonMenuShow">
          <el-input v-model.trim="form.iconClass" placeholder="请输入菜单图标" clearable/>
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
  import {addMenu, cascaderTrees, deleteMenu, menuTableList, menuTypes, updateMenu} from '../../../api/system/menu'
  import {hasIllegalChar} from '../../../utils/validate'
  import FileUpload from '../../../components/FileUpload/index'

  export default {
    name: "Menu",
    components: {
      FileUpload
    },
    data() {
      const illegalChar = (rule, value, callback) => {
        if (hasIllegalChar(value)) {
          callback(new Error("含有非法字符"));
        } else {
          callback();
        }
      };
      return {
        cascaderkey: 1,
        parentMenuList: [],
        menuTypeList: [],
        buttonMenuShow: true,
        parentMenuShow: true,
        showSearch: true,
        menuList: [],
        title: "",
        open: false,
        isExpandAll: false,
        refreshTable: true,
        queryParams: {
          name: null,
          type: null
        },
        form: {
          id: null,
          code: null,
          name: null,
          type: null,
          parentId: null,
          path: null,
          iconClass: null
        },
        rules: {
          code: [
            {required: true, message: '请输入菜单编码'},
            {min: 1, max: 100, message: '长度在 1 到 50 个字符'},
            {validator: illegalChar}
          ],
          name: [
            {required: true, message: '请输入菜单名称'},
            {min: 1, max: 50, message: '长度在 1 到 100 个字符'},
            {validator: illegalChar}
          ],
          type: [
            {required: true, message: '请选择菜单类型', trigger: 'change'}
          ],
          path: [
            {required: true, message: '请输入菜单路径'},
            {min: 1, max: 100, message: '长度在 1 到 255 个字符'}
          ],
          iconClass: [
            // {required: true, message: '请输入菜单图标'},
            {min: 1, max: 100, message: '长度在 1 到 255 个字符'},
            {validator: illegalChar}
          ],
          parentId: [
            {required: true, message: '请选择上级菜单'},
          ]
        }
      };
    },
    created() {
      this.findMenuTypes();
      this.searchList();
    },
    methods: {
      handleUploadImage() {
        this.fileOpen = true;
      },
      findMenuTypes() {
        menuTypes().then(result => {
          this.menuTypeList = result.data;
        });
      },
      typeChange(type) {
        this.buttonMenuShow = type !== 3;
        this.parentMenuShow = type !== 1;
        this.form.parentId = null;
        this.form.path = null;
        this.form.iconClass = null;
        this.getParentMenus(type);
      },
      getParentMenus(type) {
        this.cascaderkey++;
        this.parentMenuList = [];
        cascaderTrees({type: type}).then(result => {
          this.parentMenuList = result.data;
        });
      },
      cancel() {
        this.open = false;
        this.$resetForm(this.form);
      },
      searchList() {
        this.getList();
      },
      getList() {
        menuTableList(this.queryParams).then(result => {
          this.menuList = result.data;
        })
      },
      resetQuery() {
        this.$resetForm(this.queryParams);
        this.searchList();
      },
      /** 展开/折叠操作 */
      toggleExpandAll() {
        this.refreshTable = false;
        this.isExpandAll = !this.isExpandAll;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      },
      handleAdd() {
        this.$resetForm(this.form);
        this.open = true;
        this.title = '添加菜单';
        this.buttonMenuShow = true;
        this.parentMenuShow = true;
      },
      handleUpdate(row) {
        this.$resetForm(this.form);
        this.open = true;
        this.title = '修改菜单';
        this.buttonMenuShow = row.type !== 3;
        this.parentMenuShow = row.type !== 1;
        this.form.id = row.id;
        this.form.code = row.code;
        this.form.name = row.name;
        this.form.type = row.type;
        this.form.parentId = row.parentId;
        this.form.path = row.path;
        this.form.iconClass = row.iconClass;
        this.form.sort = row.sort;
        this.getParentMenus(row.type);
      },
      submitForm: function () {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id) {
              updateMenu(this.form).then(result => {
                this.refreshMenu();
              })
            } else {
              addMenu(this.form).then(result => {
                this.refreshMenu();
              });
            }
          } else {
            return false;
          }
        });
      },
      refreshMenu() {
        this.open = false;
        this.searchList();
      },
      handleDelete(row) {
        this.$confirm('确定删除？', '提示').then(() => {
          deleteMenu(row.id).then(result => {
            this.refreshMenu();
          })
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>

