# el-upload-piecess

> 结合elemenet-ui 支持分片上传

> 暂时不支持安装的方式， 主要是提供思路, 可以复制代码去使用(代码逻辑还可以继续优化)

### 代码核心在 utils.uploadByPieces 函数

##### readFileMD5 读取文件的md5
##### readChunkMD5 将读取到的文件进行分片处理
###### getChunkInfo 获取分片的个数，将分片分解，初始化上传进度等等
###### uploadChunk 上传分片，并且更新上传进度，并且在分片上传完毕之后，进行整个文件的上传

