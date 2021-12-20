<template>
    <div>
        <h3 class="title">会员调级申请</h3>

        <statistics></statistics>

        <el-row class="memberApply_form">
            <h4>上传图片（{{ uploadNum }}/5）<span>文件格式为png, jpg, jpeg 且大小不超过15MB</span></h4>
            <el-upload
                :action="upUrl"
                :data="qn"
                list-type="picture-card"
                ref="upload"
                :limit="5"
                :class="{hide:hideUploadEdit}"
                :on-change="handleEditChange"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload"
                :on-success="handleSuccess"
                :on-error="handleError">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </el-row>

        <div class="memberApply_form" v-loading.fullscreen.lock="fullscreenLoading">
            <h4>申请信息 <b class="primary-color" @click="showLevelContrast  = true">会员调级对比图 <i class="el-icon-zoom-in
"></i></b></h4>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
                <el-form-item label="会员账号" prop="member_name" style="font-weight: bold;">
                    <span v-if="ruleForm.member_name == ''" style="color: #898989;font-weight: normal;">请从 <router-link to="/memberList" class="primary-color">会员管理</router-link> 输入账号进行处理</span>
                    <el-input disabled v-model="ruleForm.member_name" v-if="ruleForm.member_name != ''" />
                </el-form-item>
                <el-form-item label="其他平台等级" prop="plat_level">
                    <el-input placeholder="请选择其他平台等级" v-model="ruleForm.plat_level" />
                </el-form-item>
                <el-form-item label="其他平台链接" prop="plat_link">
                    <el-input placeholder="请输入其他平台链接" v-model="ruleForm.plat_link" />
                </el-form-item>
                <el-form-item label="其他平台账号" prop="plat_username">
                    <el-input placeholder="请输入其他平台账号" v-model="ruleForm.plat_username" />
                </el-form-item>
                <el-form-item label="其他平台密码" prop="plat_password">
                    <el-input placeholder="请输入其他平台密码" v-model="ruleForm.plat_password" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="ruleForm.remark"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="primary-button" @click="submitForm('ruleForm')">提交申请</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-row class="remarks">
            <h4>备注说明</h4>
            <p>1：提供的图片账号需要与平台一致。</p>
            <p>2：需要提交他在其他平台的账号密码，以便官方确认。</p>
        </el-row>

        <el-dialog
            title="会员调级对比图"
            :visible.sync="showLevelContrast"
            width="40%"
            top="20px"
            :before-close="handleClose"
            style="text-align: center;">
        </el-dialog>
    </div>
</template>

<script>
    import statistics from './statistics.vue'
    import { ChangeLeveApi, UpImgApi } from '../../http/api.js'
    export default {
        data() {
            return {
                showLevelContrast: false,
                // 上传
                dialogImageUrl: '',
                dialogVisible: false,
                hideUploadEdit: false,
                uploadNum: 0,
                qn:{
                    token: ""
                },
                upUrl: "",
                // 申请信息
                ruleForm:{
                    member_name: "",
                    plat_level: "",
                    plat_link: "",
                    plat_username: "",
                    plat_password: "",
                    remark: ""
                },
                rules: {
                    // member_name: [
                    //     { required: true, message: '请输入会员账号', trigger: 'blur' },
                    // ],
                    plat_level: [
                        { required: true, message: '请选择其他平台等级', trigger: 'blur' },
                    ],
                    plat_link: [
                        { required: true, message: '请输入其他平台链接', trigger: 'blur' },
                    ],
                    plat_username: [
                        { required: true, message: '请输入其他平台账号', trigger: 'blur' },
                    ],
                    plat_password: [
                        { required: true, message: '请输入其他平台密码', trigger: 'blur' },
                    ],
                },
                imgs: "",
                // 上传图片链接
                Images: "",
                ImagesNum: 0,
                fullscreenLoading: false
            }
        },
        methods: {
            // 上传初始化获取上传接口地址和token
            UpImgData () {
                var _this = this;
                UpImgApi().then(res => {
                    _this.upUrl = res.data.message.upUrl;
                    _this.qn.token = res.data.message.Token
                }).catch(err => {
                    _this.$message.error('上传图片初始化失败')
                })
            },
            // 上传change事件
            handleEditChange(file, fileList) {
                this.hideUploadEdit = fileList.length >= 5;
                this.uploadNum = fileList.length
            },
            // 上传删除事件
            handleRemove(file, fileList) {
                this.imgs = '';
                for(var i = 0; i < fileList.length; i++){
                    this.imgs += fileList[i].response.file_path + ","
                }
                var lastIndex = this.imgs.lastIndexOf(',');
                if (lastIndex > -1) {
                    this.Images = this.imgs.substring(0, lastIndex) + this.imgs.substring(lastIndex + 1, this.imgs.length);
                }
                this.hideUploadEdit = fileList.length >= 5;
                this.uploadNum = fileList.length
            },
            // 放大上传的图片
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            // 上传图片限制格式和大小
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png'
                const isLt15M = file.size / 1024 / 1024 < 15;

                if (!isJPG && !isPNG) {
                    this.$message.error('上传头像图片只能是 JPG 和 PNG 格式!');
                }
                if (!isLt15M) {
                    this.$message.error('上传图片大小不能超过 15MB!');
                }
                return isJPG || isPNG && isLt15M;
            },
            // 上传成功
            handleSuccess(res, file) {
                this.imgs += res.file_path + ","
                var lastIndex = this.imgs.lastIndexOf(',');
                if (lastIndex > -1) {
                    this.Images = this.imgs.substring(0, lastIndex) + this.imgs.substring(lastIndex + 1, this.imgs.length);
                }
            },
            // 上传失败
            handleError() {
                this.$message.error('上传图片失败');
            },
            // 申请提交
            submitForm(formName) {
                var _this = this;
                if(this.ruleForm.member_name == ''){
                    this.$message.error('请从会员管理输入账号进行处理');
                }else{
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            if(this.Images != ''){
                                this.ruleForm['Images'] = this.Images
                            }
                            this.fullscreenLoading = true;
                            ChangeLeveApi(_this.ruleForm).then(res => {
                                // 清空表单
                                _this.$refs[formName].resetFields();
                                // 清空已上传文件
                                _this.$refs.upload.clearFiles();
                                _this.Images = "";
                                _this.imgs = "";
                                _this.uploadNum = 0;
                                _this.ruleForm.Images = '';
                                // 隐藏loading
                                _this.fullscreenLoading = false;
                                // 提示
                                _this.$message.success(res.data.message);
                            }).catch(err => {
                                _this.fullscreenLoading = false;
                                _this.$message.error(err.message)
                            })
                        } else {
                            return false;
                        }
                    });
                }
            },
            handleClose() {
                this.showLevelContrast = false
            }
        },
        created() {
            this.UpImgData();

             if(this.$route.query.name){
                this.ruleForm.member_name = this.$route.query.name;
            }
        },
        components:{
            statistics
        }
    }
</script>

<style scoped>
    @import url(../../assets/css/management.css);
</style>