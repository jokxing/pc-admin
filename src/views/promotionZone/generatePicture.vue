<template>
    <div class="generate_picture">
        <headers></headers>

        <el-row class="inner">
            <el-main>
                <el-page-header @back="$router.go(-1)" content="生成图片"></el-page-header>
                
                <el-row>
                    <div class="generate_imgBox">
                        <div class="generate_imgInner">
                            <div id="dragContainer">
                                <img :src="imgUrl">

                                <VueDragResize :aspectRatio="true" :parentLimitation="true" :w="142" :h="142" :minw="100" :minh="100" :x="458" :y="100" v-on:resizing="resize" v-show="showQrCode">
                                    <div id="qrCode" class="qrcode" ref="qrCodeDiv" style="width: 102px;height: 102px;" :style="{ background: qrCodeBgColor }"></div>
                                </VueDragResize>

                                <VueDragResize :aspectRatio="true" :parentLimitation="true" :w="142" :h="142" :minw="100" :minh="100" :x="150" :y="100" v-show="showContactImg">
                                    <img class="contact_img" :src="contactImg">
                                </VueDragResize>

                                <VueDragResize :aspectRatio="false" :isResizable="true" :parentLimitation="false" :w="100" :h="50" :minh="50" :x="50" :y="50" v-on:resizing="resizePone" v-show="showWord1">
                                    <pre :style="{ color: wordColor1, background: bgColor1, fontSize: fontsize1 + 'px' }">{{ word1 }}</pre>
                                </VueDragResize>
                                
                                <VueDragResize :aspectRatio="false" :isResizable="true" :parentLimitation="false" :w="100" :h="50" :minh="50" :x="50" :y="100" v-on:resizing="resizePtwo" v-show="showWord2">
                                    <pre :style="{ color: wordColor2, background: bgColor2, fontSize: fontsize2 + 'px' }">{{ word2 }}</pre>
                                </VueDragResize>
                                
                                <VueDragResize :aspectRatio="false" :isResizable="true" :parentLimitation="false" :w="100" :h="50" :minh="50" :x="50" :y="100" v-on:resizing="resizePthree" v-show="showWord3">
                                    <pre :style="{ color: wordColor3, background: bgColor3, fontSize: fontsize3 + 'px' }">{{ word3 }}</pre>
                                </VueDragResize>
                            </div>
                        </div>
                        <p>使用鼠标拖拽可改变二维码大小或位置</p>
                    </div>

                    <div class="generate_from">
                        <div class="generate_from_box">
                            <el-row class="generate_from_tab">
                                <ul>
                                    <li v-for="(item,index) in tabs" :class="{ bor_active: tabNum == index}" @click="tabNum = index">{{ item }}</li>
                                </ul>
                            </el-row>

                            <el-row class="generate_from_bot" v-show="tabNum == 0">
                                <p>二维码颜色</p>
                                <el-color-picker v-model="qrCodeColor" @active-change="qrCodeColorActive"></el-color-picker>
                                <p>二维码背景</p>
                                <el-color-picker v-model="qrCodeBgColor" @active-change="qrCodeBgColorActive"></el-color-picker>
                                <p>二维码颜色</p>
                                <el-input
                                    type="textarea"
                                    :rows="2"
                                    placeholder="请输入内容"
                                    v-model="qrCodeLink"
                                    @input="qrCodeLinkInput">
                                </el-input>
                                <el-checkbox v-model="showQrCode">二维码预览</el-checkbox>
                            </el-row>

                            <el-row class="generate_from_bot" v-show="tabNum == 1">
                                <p>联系方式</p>
                                <el-upload
                                    class="upload-demo"
                                    :action="upUrl"
                                    :data="qn"
                                    :on-change="handleChange"
                                    :on-success="handleSuccess"
                                    :onError="handleError"
                                    :on-remove="handleRemove"
                                    :before-upload="beforeAvatarUpload">
                                    <el-button size="small" class="btn_bor_primary" round plain v-show="showUploadBtn">上传图片</el-button>
                                </el-upload>
                            </el-row>

                            <el-row class="generate_from_bot generate_from_three" v-show="tabNum == 2">
                                <p>文字1</p>
                                <textarea 
                                    placeholder="请输入内容" 
                                    cols="30" 
                                    rows="10"
                                    v-model="word1"
                                    :style="{ color: wordColor1, background: bgColor1 }"></textarea>
                                <p>颜色</p>
                                <el-color-picker v-model="wordColor1" @active-change="wordColorActive1"></el-color-picker>
                                <p>背景</p>
                                <el-color-picker v-model="bgColor1" @active-change="bgColorActive1"></el-color-picker>
                                <el-checkbox v-model="showWord1" class="fix" style="margin-bottom: 24px;">文字预览</el-checkbox>

                                <el-row class="divider-dashed"></el-row>

                                <p>文字2</p>
                                <textarea 
                                    placeholder="请输入内容" 
                                    cols="30" 
                                    rows="10"
                                    v-model="word2"
                                    :style="{ color: wordColor2, background: bgColor2 }"></textarea>
                                <p>颜色</p>
                                <el-color-picker v-model="wordColor2" @active-change="wordColorActive2"></el-color-picker>
                                <p>背景</p>
                                <el-color-picker v-model="bgColor2" @active-change="bgColorActive2"></el-color-picker>
                                <el-checkbox v-model="showWord2" class="fix" style="margin-bottom: 24px;">文字预览</el-checkbox>

                                <el-row class="divider-dashed"></el-row>

                                <p>文字3</p>
                                <textarea 
                                    placeholder="请输入内容" 
                                    cols="30" 
                                    rows="10"
                                    v-model="word3"
                                    :style="{ color: wordColor3, background: bgColor3 }"></textarea>
                                <p>颜色</p>
                                <el-color-picker v-model="wordColor3" @active-change="wordColorActive3"></el-color-picker>
                                <p>背景</p>
                                <el-color-picker v-model="bgColor3" @active-change="bgColorActive3"></el-color-picker>
                                <el-checkbox v-model="showWord3" class="fix" style="margin-bottom: 24px;">文字预览</el-checkbox>
                            </el-row>
                        </div>

                        <div class="generate_from_btn">
                            <el-button class="btn_bor_primary" round plain @click="saveLocalClick">保存本地</el-button>
                            <el-popover
                                placement="top"
                                width="200"
                                trigger="click">
                                <div class="popover-content" style="height: 170px">
                                    <div id="qrCode" class="qrcode" ref="imgQrCodeDiv" style="width: 170px;height: 170px;margin: 0 auto"></div>
                                </div>
                                <el-button slot="reference" class="btn_bor_primary" round plain @click="mobileViewClick">手机查看</el-button>
                            </el-popover>
                            <el-button class="btn_bor_primary" round plain @click="previewClick">预览</el-button>
                        </div>
                    </div>
                </el-row>
            </el-main>
        </el-row>

        <footers></footers>
    </div>
</template>

<script>
    import headers from '../../components/header.vue'
    import footers from '../../components/footer.vue'

    import QRCode from 'qrcodejs2';
    import VueDragResize from "vue-drag-resize";
    import html2canvas from "html2canvas";
    import { base64StringToBlob } from 'blob-util'

    import { UpImgApi } from '../../http/api.js'
    export default {
        data() {
            return {
                imgUrl: localStorage.getItem('selectedBgImg'),
                tabs: ['二维码', '联系方式', '文字信息'],
                tabNum: 0,
                // 二维码
                qrCodeColor: "#000",
                qrCodeBgColor: "#fff",
                qrCodeLink: "",
                showQrCode: false,
                canvasWidth: 92,
                canvasHeight: 92,
                // 上传按钮
                showUploadBtn: true,
                // 上传初始化
                qn:{
                    token: ""
                },
                upUrl: "",
                // 上传成功后IMG
                showContactImg: false,
                contactImg: "",
                // 文字1
                word1:"",
                wordColor1: "red",
                bgColor1: "",
                showWord1: false,
                fontsize1: 16,
                // 文字2
                word2:"",
                wordColor2: "red",
                bgColor2: "",
                showWord2: false,
                fontsize2: 16,
                // 文字3
                word3:"",
                wordColor3: "red",
                bgColor3: "",
                showWord3: false,
                fontsize3: 16,
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

                })
            },
            // 初始化
            bindQRCode: function () {
                new QRCode(this.$refs.qrCodeDiv, {
                    text: this.qrCodeLink,
                    width: 92,
                    height: 92,
                    colorDark: this.qrCodeColor, //二维码颜色
                    colorLight: "#ff000000", //二维码背景色
                    correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
                })
            },
            // 缩放时事件
            resize(newRect) {
                document.getElementsByClassName('qrcode')[0].style.width = (newRect.width - 40) + "px";
                document.getElementsByClassName('qrcode')[0].style.height = (newRect.height - 40) + "px";
                document.getElementsByTagName('canvas')[0].style.width = (newRect.width - 50) + "px";
                document.getElementsByTagName('canvas')[0].style.height = (newRect.height - 50) + "px";
                this.canvasWidth = (newRect.width - 50);
                this.canvasHeight = (newRect.height - 50);
            },
            resizePone(newRect) {
                if(newRect.width < 100){
                    this.fontsize1 = 16
                }else{
                    var v = (newRect.width - 100) / 5
                    this.fontsize1 = 16 + v
                }
            },
            resizePtwo(newRect) {
                if(newRect.width < 100){
                    this.fontsize2 = 16
                }else{
                    var v = (newRect.width - 100) / 5
                    this.fontsize2 = 16 + v
                }
            },
            resizePthree(newRect) {
                if(newRect.width < 100){
                    this.fontsize3 = 16
                }else{
                    var v = (newRect.width - 100) / 5
                    this.fontsize3 = 16 + v
                }
            },
            // 二维码链接输入事件
            qrCodeLinkInput () {
                this.$refs.qrCodeDiv.innerHTML = '';
                new QRCode(this.$refs.qrCodeDiv, {
                    text: this.qrCodeLink,
                    width: this.canvasWidth,
                    height: this.canvasHeight,
                    colorDark: this.qrCodeColor, //二维码颜色
                    colorLight: "#ff000000", //二维码背景色
                    correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
                })
            },
            // 二维码颜色面板中当前显示的颜色发生改变时触发
            qrCodeColorActive (val) {
                this.$refs.qrCodeDiv.innerHTML = '';
                new QRCode(this.$refs.qrCodeDiv, {
                    text: this.qrCodeLink,
                    width: this.canvasWidth,
                    height: this.canvasHeight,
                    colorDark: val, //二维码颜色
                    colorLight: "#ff000000", //二维码背景色
                    correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
                })
            },
            // 二维码背景面板中当前显示的颜色发生改变时触发
            qrCodeBgColorActive (val) {
                this.qrCodeBgColor = val
            },
            // 上传触发change
            handleChange(file, fileList) {
                this.showUploadBtn = false
            },
            // 上传成功
            handleSuccess(res, file) {
                this.showContactImg = true;
                this.contactImg = res.file_path
            },
            // 上传报错
            handleError() {
                console.log("error")
                this.showUploadBtn = true
            },
            // 删除图片
            handleRemove() {
                this.showUploadBtn = true;
                this.contactImg = ""
            },
            // 上传图片限制格式和大小
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png'
                const isLt15M = file.size / 1024 / 1024 < 200;

                if (!isJPG && !isPNG) {
                    this.$message.error('上传头像图片只能是 JPG 和 PNG 格式!');
                }
                if (!isLt15M) {
                    this.$message.error('上传图片大小不能超过 200KB!');
                }
                return isJPG || isPNG && isLt15M;
            },
            // 文字颜色面板中当前显示的颜色发生改变时触发
            wordColorActive1 (val) {
                this.wordColor1 = val
            },
            bgColorActive1 (val) {
                this.bgColor1 = val
            },
            wordColorActive2 (val) {
                this.wordColor2 = val
            },
            bgColorActive2 (val) {
                this.bgColor2 = val
            },
            wordColorActive3 (val) {
                this.wordColor3 = val
            },
            bgColorActive3 (val) {
                this.bgColor3 = val
            },
            // 保存图片
            saveLocalClick(){
                var dragContainer = document.getElementById("dragContainer");
                let opts = {
                    useCORS: true,
                    height: dragContainer.offsetHeight, // 下面解决当页面滚动之后生成图片出现白边问题
                    width: dragContainer.offsetWidth,
                    scrollX: -8,
                    dpi: 300, // 处理模糊问题
                    scale: 1
                };
                html2canvas(dragContainer,opts).then((canvas) => {
                    var url = canvas.toDataURL('image/png');    
                    var a = document.createElement("a");
                    a.href = url;
                    a.download = "推广素材";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });
            },
            // 手机查看
            mobileViewClick () {
                var _this = this;
                this.$refs.imgQrCodeDiv.innerHTML = '';
                var dragContainer = document.getElementById("dragContainer");
                let opts = {
                    useCORS: true,
                    height: dragContainer.offsetHeight, // 下面解决当页面滚动之后生成图片出现白边问题
                    width: dragContainer.offsetWidth,
                    scrollX: -8,
                    dpi: 300, // 处理模糊问题
                    scale: 1
                };
                html2canvas(dragContainer,opts).then((canvas) => {
                    canvas.toBlob(function (blobObj) {
                        var formData = new FormData();
                        formData.append("token", _this.qn.token);
                        formData.append("file", blobObj);
                        _this.$http.post(_this.upUrl, formData).then(res => {
                            new QRCode(_this.$refs.imgQrCodeDiv, {
                                text: res.data.file_path,
                                width: 170,
                                height: 170,
                                colorDark: "#000", //二维码颜色
                                colorLight: "#fff", //二维码背景色
                                correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
                            })
                        }).catch(err => {
                        })
                    })
                });
            },
            // 预览
            previewClick() {
                var dragContainer = document.getElementById("dragContainer");
                let opts = {
                    useCORS: true,
                    height: dragContainer.offsetHeight, // 下面解决当页面滚动之后生成图片出现白边问题
                    width: dragContainer.offsetWidth,
                    scrollX: -8,
                    dpi: 300, // 处理模糊问题
                    scale: 1
                };
                html2canvas(dragContainer,opts).then(function(canvas) {
                    canvas.toBlob(function (blobObj) {
                        console.log(blobObj)
                        window.open(URL.createObjectURL(blobObj))
                    })
                });
            },
        },  
        created() {
            this.UpImgData();
        },
        mounted () {
            this.$nextTick(function () {
                this.bindQRCode();
            });
            this.qrCodeLink = localStorage.getItem('agentLink')
        },
        components:{
            headers,
            footers,
            VueDragResize
        }
    }
</script>

<style scoped>
    @import '../../assets/css/promotionZone.css';
</style>