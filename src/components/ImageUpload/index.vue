<template>
  <div class="component-upload-image">
    <el-upload
      :multiple="multiple"
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      name="file"
      :on-remove="handleRemove"
      :show-file-list="true"
      :headers="headers"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :class="{hide: this.fileList.length > 0}"
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <!-- 上传提示 -->
    <div class="el-upload__tip" slot="tip" v-if="showTip">
      请上传
      <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b></template>
      <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b></template>
      的文件
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      title="预览"
      width="800"
      append-to-body
    >
      <img :src="dialogImageUrl" style="display: block; max-width: 100%; margin: 0 auto"/>
    </el-dialog>
  </div>
</template>

<script>
  import {getToken} from "../../utils/cookie";

  export default {
    props: {
      //是否支持多选文件
      multiple: {
        type: Boolean,
        default: false
      },
      value: [String, Object, Array],
      // 图片数量限制,最大允许上传个数
      limit: {
        type: Number,
        default: 3,
      },
      // 大小限制(MB)
      fileSize: {
        type: Number,
        default: 5,
      },
      // 文件类型, 例如['png', 'jpg', 'jpeg']
      fileType: {
        type: Array,
        default: () => ["png", "jpg", "jpeg"],
      },
      // 是否显示提示
      isShowTip: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        number: 0,
        uploadList: [],
        dialogImageUrl: "",
        dialogVisible: false,
        hideUpload: false,
        //必选参数，上传的地址
        uploadImgUrl: process.env.VUE_APP_BASE_API + "/file/upload", // 上传的图片服务器地址
        //设置上传的请求头部
        headers: {
          'X-Token': getToken(),
        },
        //上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
        fileList: []
      };
    },
    // watch: {
    //   value: {
    //     handler(val) {
    //       if (val) {
    //         // 首先将值转为数组
    //         const list = Array.isArray(val) ? val : this.value.split(',');
    //         // 然后将数组转为对象数组
    //         this.fileList = list.map(item => {
    //           if (typeof item === "string") {
    //             item = {name: item, url: item};
    //           }
    //           return item;
    //         });
    //       } else {
    //         this.fileList = [];
    //         return [];
    //       }
    //     },
    //     deep: true,
    //     immediate: true
    //   }
    // },
    computed: {
      // 是否显示提示
      showTip() {
        return this.isShowTip && (this.fileType || this.fileSize);
      },
    },
    methods: {
      // 文件列表移除文件时的钩子
      handleRemove(file, fileList) {
        const findex = this.fileList.map(f => f.name).indexOf(file.name);
        if (findex > -1) {
          this.fileList.splice(findex, 1);
          this.$emit("imageChange", this.fileList);
        }
      },
      // 文件上传成功时的钩子
      handleUploadSuccess(res) {
        this.uploadList.push(res.data);
        if (this.uploadList.length === this.number) {
          this.fileList = this.fileList.concat(this.uploadList);
          this.uploadList = [];
          this.number = 0;
          this.$emit("imageChange", this.fileList);
          this.$modal.closeLoading();
        }
      },
      // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      handleBeforeUpload(file) {
        let isImg = false;
        if (this.fileType.length) {
          let fileExtension = null;
          if (file.name.lastIndexOf(".") > -1) {
            fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
          }
          if (fileExtension) {
            isImg = this.fileType.includes(fileExtension);
          }
        } else {
          isImg = file.type.indexOf("image") > -1;
        }

        if (!isImg) {
          this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`);
          return false;
        }
        if (this.fileSize) {
          const isLt = file.size / 1024 / 1024 < this.fileSize;
          if (!isLt) {
            this.$modal.msgError(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
            return false;
          }
        }
        this.$modal.loading("正在上传图片，请稍候...");
        this.number++;
      },
      // 文件超出个数限制时的钩子
      handleExceed() {
        this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
      },
      // 文件上传失败时的钩子
      handleUploadError() {
        this.$modal.msgError("上传图片失败，请重试");
        this.$modal.closeLoading();
      },
      // 预览(点击文件列表中已上传的文件时的钩子)
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 对象转成指定字符串分隔
      listToString(list, separator) {
        let strs = "";
        separator = separator || ",";
        for (let i in list) {
          strs += list[i].url + separator;
        }
        return strs !== '' ? strs.substr(0, strs.length - 1) : '';
      }
    }
  };
</script>
<style scoped lang="scss">
  // .el-upload--picture-card 控制加号部分
  ::v-deep.hide .el-upload--picture-card {
    display: none;
  }

  // 去掉动画效果
  ::v-deep .el-list-enter-active,
  ::v-deep .el-list-leave-active {
    transition: all 0s;
  }

  ::v-deep .el-list-enter, .el-list-leave-active {
    opacity: 0;
    transform: translateY(0);
  }
</style>

