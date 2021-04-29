<template>
    <div class="agent_set">
        <h4 class="title">推广素材</h4>

        <el-row :gutter="6" class="head">
            <el-form>
                <el-form-item>
                    <el-col :span="8">
                         <el-radio-group v-model="data.type">
                            <el-radio-button label="1">全部</el-radio-button>
                            <el-radio-button label="2">本月</el-radio-button>
                            <el-radio-button label="3">近三月</el-radio-button>
                            <el-radio-button label="4">半年内</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="5">
                        <el-select placeholder="请选择类型" v-model="data.genre">
                            <el-option v-for="(value, key) in list.genre" :label="value" :value="key" :key="key">{{ value }}</el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <el-select placeholder="请选择标题" v-model="data.name">
                            <el-option v-for="(v,index) in list.list" :value="v" :key="index">{{ v }}</el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <el-select placeholder="请选择尺寸" v-model="data.size">
                            <el-option v-for="(v,index) in list.size" :value="v" :key="index">{{ v }}</el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="8">
                        <el-button round class="primary-button" @click="generaAgentPopularizeData">查询</el-button>
                        <el-button round plain @click="reset">重置</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-row>

        <el-row class="agent_set_box" v-for="(value,key) in list.data" :key="key" v-loading="showLoading">
            <el-col :span="24" v-for="(v,index) in list.data[key]" :key="index">
                <div class="left">
                    <img :src="v.url">
                </div>
                <div class="right">
                    <div>
                        <p><span>所属平台：</span>{{ v.platform }}</p>
                        <p><span>更新日期：</span>{{ v.datetime }}</p>
                        <p><span>图片尺寸：</span>{{ v.size }}<span class="primary-color" style="opacity: 1;margin-left:10px;cursor: pointer;" @click="download(v)"><i class="el-icon-download"></i>下载</span></p>
                        <el-button round class="primary-button" @click="renderClick(v.url)">生成图片</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import html2canvas from "html2canvas";
    import { generaAgentPopularizeApi } from '../../http/api'
    export default {
        data() {
            return {
                showLoading: false,
                data: {
                    type: '1',
                    genre: "",
                    name: "",
                    size: ""
                },
                list:"",
            }
        },
        methods: {
            // 初始化
            generaAgentPopularizeData () {
                var _this = this;
                _this.showLoading = true;
                generaAgentPopularizeApi(_this.data).then(res => {
                    _this.showLoading = false;
                    _this.list = res.data.message;
                    localStorage.setItem('agentLink', res.data.message.url)
                }).catch(err => {
                    _this.showLoading = false
                })
            },
            // 重置
            reset() {
                this.data = {
                    type: '1',
                    genre: "",
                    name: "",
                    size: ""
                };
                this.generaAgentPopularizeData()
            },
            getUrlBase64(url) {
                return new Promise(resolve => {
                    let canvas = document.createElement('canvas')
                    let ctx = canvas.getContext('2d')
                    let img = new Image()
                    img.crossOrigin = 'Anonymous' //允许跨域
                    img.src = url
                    img.onload = function() {
                        canvas.height = 300
                        canvas.width = 300
                        ctx.drawImage(img, 0, 0, 300, 300)
                        let dataURL = canvas.toDataURL('image/png')
                        canvas = null
                        resolve(dataURL)
                    }
                })
            },
            // 下载
            download(v) {
                let canvas = document.createElement('canvas')
                let ctx = canvas.getContext('2d')
                let img = new Image()
                img.crossOrigin = 'Anonymous' //允许跨域
                img.src = v.url
                img.onload = function() {
                    canvas.height = img.height;
                    canvas.width = img.width;
                    ctx.drawImage(img, 0, 0, img.width, img.height)
                    let dataURL = canvas.toDataURL('image/png')

                    let link = document.createElement('a')
                    link.href = dataURL
                    link.download = v.title
                    link.click()
                }
            },
            // 生成图片
            renderClick(url) {
                var imgUrl = url;
                localStorage.setItem('selectedBgImg', imgUrl);
                this.$router.push('/generatePicture')
            }
        },
        mounted() {
            this.generaAgentPopularizeData()
        },
    }
</script>

<style scoped>
    @import '../../assets/css/promotionZone.css';
</style>