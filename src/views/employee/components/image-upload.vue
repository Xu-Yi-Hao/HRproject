<template>
    <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload"
        :http-request="uploadImage">
        <img v-if="value" :src="value" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'
export default {
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    methods: {
        beforeAvatarUpload(file) {
            const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type);
            const isLt2M = file.size / 1024 / 1024 < 5;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG PNG GIF BMP 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 5MB!');
            }
            return isJPG && isLt2M;
        },
        uploadImage(params) {
            const cos = new COS({
                SecretId: 'AKIDEMJ9pIXCg0DMUZWM2bLvPimdjpsw4CJP',
                SecretKey: 'LlAa3Y6gDlL8znYFvcM2CfBsaK5ql4IM'
            })
            cos.putObject({
                Bucket: 'heima-hr-1323069730',
                Region: 'ap-beijing',
                Key: params.file.name,
                StorageClass: 'STANDARD',
                Body: params.file
            }, (err, data) => {
                console.log(err, data);
                if (data.statusCode === 200 && data.Location) {
                    this.$emit('input', `https://${data.Location}`)
                } else {
                    this.$message.error(err.Message)
                }
            })
        },
    }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>