<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片部分 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column label="序号" width="100" type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
        <el-table-column prop="path" label="路径" width="250"></el-table-column>
        <el-table-column prop="level" label="等级">
            <template slot-scope="info">
                <el-tag v-if ="info.row.level === '0'">一级</el-tag>
                <el-tag v-else-if ="info.row.level === '1'" type="success">二级</el-tag>
                <el-tag v-else type="warning">三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取后台数据  发送ajax请求 返回promise对象
    async getRightsList() {
      const { data: dt } = await this.$http.get('rights/list')
      console.log(dt)
      this.rightsList = dt.data
    }
  },
  data() {
    return {
      // 权限数据列表成员
      rightsList: []
    }
  }
}
</script>

<style lang="less" scoped>
</style>
