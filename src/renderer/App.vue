<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'superadmin'
  }
</script>

<style>
  /* CSS */
  *{margin: 0;padding: 0;}
  body{
      user-select:none;
      font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  .el-table{
    user-select: auto;
  }
  #app{
    background: url('./assets/bg.jpg') no-repeat center;
    background-size: cover;
  }
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background-color:rgb(148, 148, 148);
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius:2em;
  }
  ::-webkit-scrollbar-thumb {
    background-color:rgb(54, 218, 230);
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius:2em;
  }
  .el-tooltip__popper{
    width: 80%;
  }
</style>
