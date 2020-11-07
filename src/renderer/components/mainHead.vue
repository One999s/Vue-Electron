<template>
    <div class="main-head">
        <div class="main-title">
            <img src="../assets/proje.png" style="width:100px;height:50px" alt="">
            <p>by:One9s<span style="color:rgba(0,0,0,.1)">ss</span></p>
        </div>
        <div class="main-head-handle">
            <i class="el-icon-remove handleI" @click="miniWindow()"></i>
            <i class="el-icon-error handleI" @click="closeWindow()"></i>
        </div>
    </div>
</template>

<script>
import {remote} from 'electron'
export default {
    data() {
        return {
            
        }
    },
    methods: {
        miniWindow(){
            let win = remote.getCurrentWindow()
            if(win.isMinimized()){
                win.restore()
            }else{
                win.minimize()
            }
        },
        closeWindow(){
            remote.app.quit()
        }
    },
}
</script>

<style lang="scss" scoped>
    .main-head{
        -webkit-app-region: drag;
        width: 100%;
        // padding: 0 .7rem;
        display: flex;
        justify-content: space-between;
    }
    .main-head-handle{
        display: flex;
        justify-content: flex-end;
        .handleI{
            font-size: 20px;
            margin:5px 3px;
            cursor: pointer;
            -webkit-app-region: no-drag;
        }
    }
    .main-title{
        font-weight: bold;
        display: flex;
        align-items: center;
        p{
            color: rgba(255, 255, 255,.9);
            font-family: 楷体;
        }
    }
</style>