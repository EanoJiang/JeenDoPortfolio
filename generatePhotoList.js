// 照片数组生成脚本
const fs = require('fs');
const path = require('path');

// 照片文件夹路径
const photoDir = path.join(__dirname, 'photo');

// 自动识别照片标题的函数
function generateTitle(filename) {
    // 移除扩展名
    let title = path.basename(filename, path.extname(filename));
    
    // 移除数字前缀（如 "1.", "01." 等）
    title = title.replace(/^\d+\./, '');
    
    // 替换特殊符号为中文描述
    title = title.replace(/we\'re the boss/i, '我们是老板');
    title = title.replace(/SHREDDER/i, '碎纸机');
    title = title.replace(/soldier/i, '战士');
    title = title.replace(/weapon/i, '武器');
    title = title.replace(/brain washed/i, '洗脑');
    title = title.replace(/DEATH MEATL/i, '死亡金属');
    title = title.replace(/submashine gun/i, '冲锋枪');
    title = title.replace(/CNcapital/i, '中国资本');
    title = title.replace(/FED hunter/i, '联邦猎人');
    title = title.replace(/capital/i, '资本');
    title = title.replace(/wtf 2019/i, '超现实视觉 2019');
    title = title.replace(/wtf 2021/i, '超现实视觉 2021');
    title = title.replace(/wtf2021/i, '超现实视觉 2021');
    title = title.replace(/wtf2024/i, '超现实视觉 2024');
    
    // 去除多余的空格和特殊字符
    title = title.replace(/[_\(\)\.]/g, ' ').trim();
    
    return title;
}

// 获取照片文件列表
function getPhotoFiles() {
    try {
        // 读取目录
        const files = fs.readdirSync(photoDir);
        
        // 过滤出图片文件
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
        });
        
        // 优化排序逻辑：对数字文件名进行数字排序
        imageFiles.sort((a, b) => {
            // 提取a的纯数字文件名部分（如果有）
            const aMatch = a.match(/^(\d+)\./);
            const aIsNumber = aMatch !== null;
            const aNum = aIsNumber ? parseInt(aMatch[1], 10) : 0;
            
            // 提取b的纯数字文件名部分（如果有）
            const bMatch = b.match(/^(\d+)\./);
            const bIsNumber = bMatch !== null;
            const bNum = bIsNumber ? parseInt(bMatch[1], 10) : 0;
            
            // 如果两者都是数字文件名，按数字大小排序
            if (aIsNumber && bIsNumber) {
                return aNum - bNum;
            }
            
            // 如果a是数字文件名而b不是，a排在前面
            if (aIsNumber && !bIsNumber) {
                return -1;
            }
            
            // 如果b是数字文件名而a不是，b排在前面
            if (!aIsNumber && bIsNumber) {
                return 1;
            }
            
            // 如果都不是数字文件名，按字母顺序排序
            return a.localeCompare(b);
        });
        
        return imageFiles;
    } catch (error) {
        console.error('无法读取照片目录:', error.message);
        return [];
    }
}

// 生成照片数组
function generatePhotoArray() {
    const photos = getPhotoFiles();
    const photoArray = [];
    
    // 处理照片
    photos.forEach(photo => {
        const title = generateTitle(photo);
        photoArray.push({
            src: `photo/${photo}`,
            title: title
        });
    });
    
    return photoArray;
}

// 生成JavaScript代码
function generateCode() {
    const photoArray = generatePhotoArray();
    let code = `// 此代码由自动脚本生成于 ${new Date().toLocaleString()}\n`;
    code += `document.addEventListener('DOMContentLoaded', function() {\n`;
    code += `    // 照片数据数组\n`;
    code += `    const photoData = [\n`;
    
    // 添加所有照片
    photoArray.forEach(photo => {
        // 处理可能包含单引号的文件名
        const safeFilename = photo.src.replace(/'/g, "\\'");
        code += `        { src: '${safeFilename}', title: '${photo.title}' },\n`;
    });
    
    code += `    ];\n\n`;
    
    // 添加标准的画廊生成和交互代码
    code += `    // 获取画廊容器
    const gallery = document.getElementById('gallery');
    
    // 图片延迟加载状态跟踪
    const loadedImages = new Set();
    
    // 动态生成画廊项目
    photoData.forEach((photo, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.className = 'gallery-img';
        img.alt = photo.title;
        img.dataset.src = photo.src; // 使用data属性存储真实地址
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23cccccc"/%3E%3C/svg%3E'; // 加载占位图
        
        const caption = document.createElement('div');
        caption.className = 'gallery-caption';
        caption.textContent = photo.title;
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(caption);
        gallery.appendChild(galleryItem);
        
        // 为每个画廊项目添加点击事件，打开模态框
        galleryItem.addEventListener('click', function() {
            // 点击时才加载原始图片
            loadOriginalImage(photo.src, function(loadedSrc) {
                openModal(loadedSrc);
            });
        });
        
        // 添加到延迟加载观察队列
        observeImage(img, index);
    });
    
    // 使用 Intersection Observer API 实现图片延迟加载
    function observeImage(imgElement, delay) {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 延迟加载，根据索引计算延迟时间
                    setTimeout(() => {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        if (src && !loadedImages.has(src)) {
                            img.src = src;
                            loadedImages.add(src);
                            
                            // 图片加载成功
                            img.onload = function() {
                                img.classList.add('loaded');
                            };
                            
                            // 图片加载失败
                            img.onerror = function() {
                                // 加载失败时使用替代图片
                                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23f44336"/%3E%3Ctext x="50%25" y="50%25" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle"%3E加载失败%3C/text%3E%3C/svg%3E';
                            };
                        }
                        
                        // 不再观察这个元素
                        observer.unobserve(img);
                    }, delay * 100); // 逐个延迟加载，避免同时请求过多
                }
            });
        }, options);
        
        // 开始观察
        observer.observe(imgElement);
    }
    
    // 加载原始图片函数
    function loadOriginalImage(src, callback) {
        // 如果图片已经加载过，直接使用
        if (loadedImages.has(src)) {
            callback(src);
            return;
        }
        
        // 否则新建一个图片对象加载
        const tempImg = new Image();
        tempImg.onload = function() {
            loadedImages.add(src);
            callback(src);
        };
        tempImg.onerror = function() {
            // 加载失败时使用替代图片
            callback('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23f44336"/%3E%3Ctext x="50%25" y="50%25" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle"%3E加载失败%3C/text%3E%3C/svg%3E');
        };
        tempImg.src = src;
    }
    
    // 获取模态框元素
    const modal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.getElementsByClassName('close')[0];
    
    // 打开模态框
    function openModal(imgSrc) {
        modal.style.display = 'flex';
        modalImg.src = imgSrc;
        document.body.classList.add('modal-open');
        
        // 重置缩放级别
        modalImg.style.transform = 'scale(1)';
        modalImg.style.top = '0';
        modalImg.style.left = '0';
        document.querySelector('.zoom-level').textContent = '100%';
    }
    
    // 关闭模态框
    closeBtn.onclick = function() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    };
    
    // 点击模态框背景也关闭模态框
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    };
    
    // 模态框中的图片缩放功能
    let scale = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    
    // 鼠标滚轮缩放
    modal.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.max(1, Math.min(3, scale + delta));
        
        if (scale !== newScale) {
            scale = newScale;
            
            // 只有当放大时才能拖动
            if (scale > 1) {
                modalImg.classList.add('zoomable');
            } else {
                modalImg.classList.remove('zoomable');
                translateX = 0;
                translateY = 0;
            }
            
            // 更新变换
            updateTransform();
            
            // 更新缩放级别显示
            document.querySelector('.zoom-level').textContent = Math.round(scale * 100) + '%';
        }
    });
    
    // 鼠标拖动功能
    modalImg.addEventListener('mousedown', function(e) {
        if (scale > 1) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            modalImg.style.cursor = 'grabbing';
        }
    });
    
    modal.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const maxTranslate = 100 * (scale - 1);
            translateX = Math.min(maxTranslate, Math.max(-maxTranslate, e.clientX - startX));
            translateY = Math.min(maxTranslate, Math.max(-maxTranslate, e.clientY - startY));
            updateTransform();
        }
    });
    
    modal.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            modalImg.style.cursor = scale > 1 ? 'grab' : 'auto';
        }
    });
    
    modal.addEventListener('mouseleave', function() {
        if (isDragging) {
            isDragging = false;
            modalImg.style.cursor = scale > 1 ? 'grab' : 'auto';
        }
    });
    
    // 更新图片变换
    function updateTransform() {
        modalImg.style.transform = \`scale(\${scale}) translate(\${translateX / scale}px, \${translateY / scale}px)\`;
    }
    
    // 键盘控制
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'flex') {
            if (e.key === 'Escape') {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }
        }
    });
});`;
    
    return code;
}

// 更新脚本文件
function updateScriptFile() {
    const newCode = generateCode();
    
    try {
        // 备份原始脚本
        const scriptPath = path.join(__dirname, 'script.js');
        const backupPath = path.join(__dirname, `script_backup_${Date.now()}.js`);
        
        if (fs.existsSync(scriptPath)) {
            fs.copyFileSync(scriptPath, backupPath);
            console.log(`原始脚本已备份为: ${backupPath}`);
        }
        
        // 写入新脚本
        fs.writeFileSync(scriptPath, newCode);
        console.log('脚本已更新成功！');
        
        // 输出照片总数
        const photos = getPhotoFiles();
        console.log(`共包含 ${photos.length} 张照片`);
    } catch (error) {
        console.error('更新脚本时出错:', error.message);
    }
}

// 执行更新
updateScriptFile(); 