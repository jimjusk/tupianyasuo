document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewContainer = document.querySelector('.preview-container');
    const compressionControls = document.querySelector('.compression-controls');

    let originalImage = null;

    // 处理文件拖放
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#f0f0f0';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = 'white';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = 'white';
        const file = e.dataTransfer.files[0];
        const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (file && supportedTypes.includes(file.type)) {
            handleImageUpload(file);
        } else {
            alert('请上传支持的图片格式：JPG、PNG、GIF、WebP');
        }
    });

    // 处理文件选择
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // 处理图片上传
    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = () => {
                // 显示原图预览
                originalPreview.src = originalImage.src;
                originalSize.textContent = `文件大小: ${formatFileSize(file.size)}`;
                
                // 显示预览区域和控制器
                previewContainer.style.display = 'grid';
                compressionControls.style.display = 'block';
                
                // 压缩图片
                compressImage();
            };
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置画布尺寸
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        
        // 绘制图片
        ctx.drawImage(originalImage, 0, 0);
        
        // 压缩
        const quality = qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // 显示压缩后的预览
        compressedPreview.src = compressedDataUrl;
        
        // 计算压缩后的文件大小
        const compressedSize = Math.round((compressedDataUrl.length * 3) / 4);
        document.getElementById('compressedSize').textContent = 
            `文件大小: ${formatFileSize(compressedSize)}`;
    }

    // 质量滑块变化时重新压缩
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value + '%';
        if (originalImage) {
            compressImage();
        }
    });

    // 下载压缩后的图片
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'compressed_image.jpg';
        link.href = compressedPreview.src;
        link.click();
    });

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 