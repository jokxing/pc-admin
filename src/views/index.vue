<template>
    <div>
        <el-row>
            <headers></headers>
        </el-row>
        <el-row class="main">
            <div class="inner">
                <announcement></announcement>
                <asides></asides>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </div>
        </el-row>
        <el-row>
            <footers></footers>
        </el-row>
    </div>
</template>

<script>
    import headers from '../components/header.vue'
    import announcement from '../components/announcement.vue'
    import asides from '../components/aside.vue'
    import footers from '../components/footer.vue'
    export default {
        components:{
            headers,
            announcement,
            asides,
            footers
        }
    }
</script>

<style scoped>
    .main{
        width: 100%;
        background-image: url(../assets/img/main_bg.png);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: top center;
        padding-bottom: 24px;
    }
    .inner{
        width: 1200px;
        margin: 0 auto;
    }
    .el-main{
        width: 970px;
        min-height: 1070px;
        background-color: #fff;
        border-radius: 10px;
        float: right;
    }
</style>