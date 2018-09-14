# el-upload-piecess

> 结合elemenet-ui 支持分片上传

> 暂时不支持安装的方式， 主要是提供思路, 可以复制代码去使用(代码逻辑还可以继续优化)

### 代码核心在 utils.uploadByPieces 函数

##### readFileMD5 读取文件的md5
```
  const readFileMD5 = (files) => {
    // 读取每个文件的md5
    files.map((file, index) => {
      let fileRederInstance = new FileReader()
      fileRederInstance.readAsBinaryString(file)
      fileRederInstance.addEventListener('load', e => {
        let fileBolb = e.target.result
        let fileMD5 = md5(fileBolb)
        if (!fileList.some((arr) => arr.md5 === fileMD5)) {
          fileList.push({md5: fileMD5, name: file.name, file})
          AllFileSize = AllFileSize + file.size
        }
        if (index === files.length - 1) readChunkMD5(fileList)
      }, false)
    })
  }
```
##### readChunkMD5 将读取到的文件进行分片处理
```
  // 针对每个文件进行chunk处理
  const readChunkMD5 = (fileList) => {
    fileList.map((currentFile, fileIndex) => {
      const chunkSize = pieceSize * 1024 * 1024 // 5MB一片
      const chunkCount = Math.ceil(currentFile.file.size / chunkSize) // 总片数
      AllChunk = AllChunk + chunkCount // 计算全局chunk数
      // let fileSize = currentFile.file.size // 文件大小
      // 针对单个文件进行chunk上传
      for (var i = 0; i < chunkCount; i++) {
        const { chunk } = getChunkInfo(currentFile.file, i, chunkSize)
        let chunkFR = new FileReader()
        chunkFR.readAsBinaryString(chunk)
        chunkFR.addEventListener('load', e => {
          let chunkBolb = e.target.result
          let chunkMD5 = md5(chunkBolb)
          this.readingFile = false
          uploadChunk(currentFile, {chunkMD5, chunk, currentChunk: i, chunkCount}, fileIndex)
        }, false)
      }
    })
  }
```
###### uploadChunk 上传分片，并且更新上传进度，并且在分片上传完毕之后，进行整个文件的上传
```
  const uploadChunk = (currentFile, chunkInfo, fileIndex) => {
    let fetchForm = new FormData()
    fetchForm.append('file_name', currentFile.name)
    fetchForm.append('md5', currentFile.fileMD5)
    fetchForm.append('data', chunkInfo.chunk)
    fetchForm.append('chunks', chunkInfo.chunkCount)
    fetchForm.append('chunk_index', chunkInfo.currentChunk)
    fetchForm.append('chunk_md5', chunkInfo.chunkMD5)
    fetch({
      type: 'post',
      url: chunkUrl,
      data: fetchForm
    }).then(res => {
      progressFun()
      // currentAllChunk++
      if (chunkInfo.currentChunk < chunkInfo.chunkCount - 1) {
        successAllCount++
      } else {
        // 当总数大于等于分片个数的时候
        if (chunkInfo.currentChunk >= chunkInfo.chunkCount - 1) {
          uploadFile(currentFile, fileIndex)
        }
      }
    }).catch((e) => {
      error && error(e)
    })
  }
```
###### uploadFile 整个文件(某个已经分片已经全部上传完的文件)的上传
```
  // 对分片已经处理完毕的文件进行上传
  const uploadFile = (currentFile) => {
    let makeFileForm = new FormData()
    makeFileForm.append('md5', currentFile.fileMD5)
    makeFileForm.append('file_name', currentFile.name)
    fetch({ // 合并文件
      type: 'post',
      url: fileUrl,
      data: makeFileForm
    }).then(res => {
      progressFun()
      res.file_name = currentFile.name
      success && success(res)
      successAllCount++
    }).catch(e => {
      error && error(e)
    })
  }
```

***注意*** 
  > 1、这里的上传是并行的，如果要串行需要改造代码
  
  > 2、分片上传需要后端配合  

