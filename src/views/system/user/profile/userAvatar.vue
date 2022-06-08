<template>
  <div>
    <div class="user-info-head" @click="editCropper()"><img v-bind:src="headImageUrl" title="点击上传头像" class="img-circle img-lg"/></div>
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @opened="modalOpened" @close="closeDialog">
      <el-row>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            @realTime="realTime"
            v-if="visible"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img"/>
          </div>
        </el-col>
      </el-row>
      <br/>
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
            <el-button size="small">
              选择
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{span: 1, offset: 2}" :md="2">
          <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"></el-button>
        </el-col>
        <el-col :lg="{span: 2, offset: 6}" :md="2">
          <el-button type="primary" size="small" @click="uploadImg()">提 交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import store from "../../../../store";
  import {VueCropper} from "vue-cropper";
  import {updateHeadImageUrl} from "../../../../api/system/user";
  import {upload} from "../../../../api/upload";

  export default {
    components: {VueCropper},
    props: {
      user: {
        type: Object
      }
    },
    data() {
      return {
        // 文件类型, 例如['png', 'jpg', 'jpeg']
        fileType: ["png", "jpg", "jpeg"],
        // 大小限制(MB)
        fileSize: 5,
        // 是否显示弹出层
        open: false,
        // 是否显示cropper
        visible: false,
        // 弹出层标题
        title: "修改头像",
        options: {
          img: store.getters.headImageUrl, //裁剪图片的地址
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 200, // 默认生成截图框宽度
          autoCropHeight: 200, // 默认生成截图框高度
          fixedBox: true // 固定截图框大小 不允许改变
        },
        previews: {}
      };
    },
    computed: {
      ...mapGetters([
        'headImageUrl'
      ])
    },
    methods: {
      // 编辑头像
      editCropper() {
        this.open = true;
      },
      // 打开弹出层结束时的回调
      modalOpened() {
        this.visible = true;
      },
      // 覆盖默认的上传行为
      requestUpload() {
      },
      // 向左旋转
      rotateLeft() {
        this.$refs.cropper.rotateLeft();
      },
      // 向右旋转
      rotateRight() {
        this.$refs.cropper.rotateRight();
      },
      // 图片缩放
      changeScale(num) {
        num = num || 1;
        this.$refs.cropper.changeScale(num);
      },
      // 上传预处理
      beforeUpload(file) {
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
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.options.img = reader.result;
        };
      },
      // 上传图片
      uploadImg() {
        this.$refs.cropper.getCropBlob(data => {
          let formData = new FormData();
          formData.append("file", data);
          upload(formData).then(response => {
            const {url} = response.data;
            updateHeadImageUrl(url).then(response => {
              this.open = false;
              this.$store.commit('user/SET_USER_HEAD_IMAGE', this.options.img);
              this.$modal.msgSuccess("修改成功");
              this.visible = false;
            });
          });
        });
        // this.$refs.cropper.getCropBlob(data => {
        //   let formData = new FormData();
        //   formData.append("avatarfile", data);
        //   updateHeadImageUrl(formData).then(response => {
        //     this.open = false;
        //     this.options.img = response.imgUrl;
        //     store.commit('SET_AVATAR', this.options.img);
        //     this.$modal.msgSuccess("修改成功");
        //     this.visible = false;
        //   });
        // });
      },
      // 实时预览
      realTime(data) {
        this.previews = data;
      },
      // 关闭窗口
      closeDialog() {
        this.options.img = store.getters.avatar
        this.visible = false;
      }
    }
  };
</script>
<style scoped lang="scss">
  .user-info-head {
    position: relative;
    display: inline-block;
    height: 120px;
  }

  .user-info-head:hover:after {
    content: '+';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    color: #eee;
    background: rgba(0, 0, 0, 0.5);
    font-size: 24px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    cursor: pointer;
    line-height: 110px;
    border-radius: 50%;
  }
</style>
