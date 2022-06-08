<template>
  <el-form ref="form" :model="userInfo" :rules="rules" label-width="80px">
    <el-form-item label="用户名" prop="name">
      <el-input v-model.trim="userInfo.name" placeholder="请输入用户名" maxlength="20" show-word-limit/>
    </el-form-item>
    <el-form-item label="手机号码" prop="phone">
      <el-input v-model.trim="userInfo.phone" placeholder="请输入手机号码" maxlength="11" show-word-limit/>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model.trim="userInfo.email" placeholder="请输入邮箱" maxlength="30" show-word-limit/>
    </el-form-item>
    <el-form-item label="住址" prop="address">
      <el-input v-model.trim="userInfo.address" placeholder="请输入住址" maxlength="100" show-word-limit/>
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="userInfo.sex">
        <el-radio label="男">男</el-radio>
        <el-radio label="女">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {updateUserProfile} from "../../../../api/system/user";
  import {hasIllegalChar} from "../../../../utils/validate";

  export default {
    props: {
      user: {
        type: Object
      }
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
        userInfo: {...this.user},
        // 表单校验
        rules: {
          name: [
            {required: true, message: "用户名不能为空", trigger: "blur"},
            {validator: illegalChar}
          ],
          phone: [
            {required: true, message: "手机号码不能为空", trigger: "blur"},
            {pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur"}
          ],
          email: [
            // {required: true, message: "邮箱地址不能为空", trigger: "blur"},
            {type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"]}
          ],
          address: [
            {validator: illegalChar}
          ]
        }
      };
    },
    methods: {
      submit() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateUserProfile({
              name: this.userInfo.name,
              phone: this.userInfo.phone,
              email: this.userInfo.email,
              address: this.userInfo.address,
              sex: this.userInfo.sex,
            }).then(response => {
              this.$modal.msgSuccess("修改成功");
              window.location.reload();
            });
          }
        });
      },
      close() {
        this.$tab.closePage();
      }
    }
  };
</script>
