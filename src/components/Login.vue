<template>
    <div id="login">
        <!-- <p>管理员登录系统</p> -->
        <div id="login-box">
            <div id="login-img-box">
                <img src="../assets/logo.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
    #login{
        height: 100%;
        background-color: #2b4b6b;
        // overflow: hidden;
        // p{
        //     margin: 0;
        //     // padding: 0;e
        //     text-align: center;
        //     font-size: 50px;
        //     color: #fff;
        // }
        #login-box{
            width: 450px;
            height: 304px;
            background-color: #fff;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            border-radius: 4px;
            #login-img-box{
                width: 130px;
                height: 130px;
                border: 1px solid #eee;
                padding: 8px;
                border-radius: 50%;
                position: absolute;
                left: 50%;
                transform: translate(-50%,-50%);
                background-color: #fff;
                box-shadow: 0 0 10px #eee;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: #eee;
                }
            }
        }
    }
</style>
