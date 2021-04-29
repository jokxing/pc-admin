<template>
    <el-footer height="116px">
        <div class="footer_inner">
            <img src="../assets/img/footer_img.png" alt="">
            <p>客服电话：{{ telephone }}<span style="margin-left:30px">版权所有 ©2018-2020 bo men Ji Tuan All rights reserved</span>  <span style="margin-left:10px">保留所有权</span></p>
        </div>
    </el-footer>
</template>

<script>
    import { contact_usApi } from '../http/api'
    export default {
        data () {
            return {
                telephone: ""
            }
        },
        mounted () {
            var _this = this;
            contact_usApi().then(res => {
                _this.telephone = res.data.message.telephone
            }).catch(err => {
            })
        }
    }
</script>

<style scoped>
    .el-footer{
        width: 100%;
        background-color: #2A2B36;
    }
    .footer_inner{
        width: 1200px;
        margin: 0 auto;
    }
    .footer_inner img{
        width: 100%;
        padding: 20px 0;
    }
    .footer_inner p{
        color: #8C9299;
        font-size: 14px;
        text-align: center;
    }
</style>