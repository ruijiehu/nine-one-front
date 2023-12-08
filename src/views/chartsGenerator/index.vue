<template>
  <div class="charts-generator">
    <template-select></template-select>
  </div>
</template>

<script>
import templateSelect from './template-select'
// import openDialog from '@/components/open-dialog'
// import { WATCHED_CHART_VIDEO_KEY } from '@/common/config'
const WATCHED_CHART_VIDEO_KEY = 'WATCHED_CHART_VIDEO_KEY'
export default {
  components: { templateSelect },
  data() {
    return {
      isCourseVideoShow: false,
      imageUrl: '',
      roleForm: {},
      stateList: [{ label: '全部', value: '' }, { label: '处理中', value: '2' }, { label: '已办结', value: '3' }, { label: '已完成', value: '4' }],
      imgs: ['../../assets/img/pie0.jpg', '~@/assets/img/pie1.jpg', '~@/assets/img/pie2.jgp', '~@/assets/img/pie3.jgp']
    }
  },
  mounted() {
    // this.checkVideoWatch()
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 检查视频是否观看，没有观看过第一次弹出
    checkVideoWatch() {
      const isWatched = localStorage.getItem(WATCHED_CHART_VIDEO_KEY)
      if (!isWatched) {
        this.isCourseVideoShow = true
      }
      localStorage.setItem(WATCHED_CHART_VIDEO_KEY, 1)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 观看使用流程
    lookCourse() {
      this.isCourseVideoShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.lookVideo{
  position: absolute;
  top: 10px;
  left: 30px;
  font-size: 18px;
}
.video_dialog{
    /deep/ .model-content{
      width: 98% !important;
      height: 90% !important;
      max-height: 100% !important;
      top: 20px;
      display: flex;
    }
    /deep/ .dialog-body{
      display: flex;
      align-items: center;
      justify-content: center;
      .video_body{
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }
  }
 }
.charts-generator{
  width: 100%;
  height: 100%;
 display: flex;
 position: relative;
  // justify-content: center;
  // width:60%;
  flex-direction: column;
  // padding:20px 50px;
  box-sizing: border-box;
  padding-top: 40px;
  // .title{
  //   font-size: 20px;
  //    color: #8c939d;
  //    margin-bottom:20px;
  // }
  .imgs{
    display: flex;
    img{
      margin:20px 30px;
    }
  }
  .thumbs{
    display: flex;
    margin-top: 50px;
  }
  .thumb{
     border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    // overflow: hidden;
    position: relative;
      width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    .icon-thumb{
      width:110px;
      height: 110px;
      // background: url('~@/assets/img/app-icon.png');
      display: inline-block;

    }
    .title{
      position: absolute;
      bottom: -30px;
      left:50px;
       color: #8c939d;
    }
    // i{
    //   width: 178px;
    // height: 178px;
    // line-height: 178px;
    // font-size: 28px;
    //     color: #8c939d;
    //      text-align: center;
    // }
  }
}
  /deep/.avatar-uploader{
    margin-right:50px;
    /deep/.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &::after{
      content:'自动识别';
      position: absolute;
      bottom: -30px;
      left:50px;
       color: #8c939d;
    }
    }
  }
  /deep/.avatar-uploader {.el-upload:hover {
    border-color: #409EFF;
  }}
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
