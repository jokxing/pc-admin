<template>
    <div class="memberLineApply" v-loading.fullscreen.lock="fullscreenLoading">
        <h3 class="title">会员转线申请</h3>

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

        <el-row class="memberApply_form">
            <h4>申请信息</h4>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
                <el-form-item label="会员账号" prop="member_name">
                    <el-input v-model="ruleForm.member_name" maxlength="10" placeholder="请输入会员账号"></el-input>
                </el-form-item>
                <el-form-item label="引导链接" prop="guide_link">
                    <el-input v-model="ruleForm.guide_link" placeholder="请输入引导链接"></el-input>
                </el-form-item>
                <el-form-item label="终端类型" prop="terminal_type">
                    <el-select v-model="ruleForm.terminal_type" placeholder="请选择终端">
                        <el-option label="苹果" value="1"></el-option>
                        <el-option label="安卓" value="2"></el-option>
                        <el-option label="PC电脑" value="3"></el-option>
                        <el-option label="H5手机" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="ruleForm.remark"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="primary-button" @click="submitForm('ruleForm')">提交申请</el-button>
                </el-form-item>
            </el-form>
        </el-row>

        <el-row class="remarks">
            <h4>备注说明</h4>
            <p>1：会员是在总线的，不在其他代理线下。</p>
            <p>2：充值少于10000。</p>
            <p>3：提供登陆信息图片和其他证明在你线下的图片。</p>
        </el-row>
    </div>
</template>

<script>
    import statistics from './statistics.vue'
    import { ChangeLineApi, UpImgApi } from '../../http/api.js'
    export default {
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                hideUploadEdit: false,
                uploadNum: 0,
                qn:{
                    token: ""
                },
                upUrl: "",
                // 申请信息
                ruleForm: {
                    member_name: '',
                    guide_link: "",
                    terminal_type: "",
                    remark: ''
                },
                rules: {
                    member_name: [
                        { required: true, message: '请输入会员账号', trigger: 'blur' },
                    ],
                    guide_link: [
                        { required: true, message: '请输入引导链接', trigger: 'blur' },
                    ],
                    terminal_type: [
                        { required: true, message: '请选择终端', trigger: 'change' },
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
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.Images != ''){
                            this.ruleForm['Images'] = this.Images
                        }
                        this.fullscreenLoading = true;
                        ChangeLineApi(_this.ruleForm).then(res => {
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
            },
        },
        created() {
            this.UpImgData();
        },
        components: {
            statistics
        }
    }
</script>

<style scoped>
    @import url(../../assets/css/management.css);
</style>