// 此代码由自动脚本生成于 2025/5/15 01:00:30
document.addEventListener('DOMContentLoaded', function() {
    // 照片数据数组
    const photoData = [
        { src: 'photo/1.jpg', title: '1' },
        { src: 'photo/2.jpg', title: '2' },
        { src: 'photo/3.jpg', title: '3' },
        { src: 'photo/4.jpg', title: '4' },
        { src: 'photo/5.jpg', title: '5' },
        { src: 'photo/6.jpg', title: '6' },
        { src: 'photo/7.jpg', title: '7' },
        { src: 'photo/8.jpg', title: '8' },
        { src: 'photo/9.jpg', title: '9' },
        { src: 'photo/10.jpg', title: '10' },
        { src: 'photo/11.jpg', title: '11' },
        { src: 'photo/12.jpg', title: '12' },
        { src: 'photo/13.jpg', title: '13' },
        { src: 'photo/14.jpg', title: '14' },
        { src: 'photo/15.jpg', title: '15' },
        { src: 'photo/16.jpg', title: '16' },
        { src: 'photo/17.jpg', title: '17' },
        { src: 'photo/18.jpg', title: '18' },
        { src: 'photo/19.jpg', title: '19' },
        { src: 'photo/20.jpg', title: '20' },
        { src: 'photo/21.jpg', title: '21' },
        { src: 'photo/22.jpg', title: '22' },
        { src: 'photo/23.jpg', title: '23' },
        { src: 'photo/24.jpg', title: '24' },
    ];

    // 获取画廊容器
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
        
        // 重置拖动状态
        isDragging = false;
        translateX = 0;
        translateY = 0;
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
        // 移除最大缩放限制，只保留最小值为1
        const newScale = Math.max(1, scale + delta);
        
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
    
    // 鼠标拖动逻辑优化：
    // 1. 将事件处理移动到一个对象，方便管理和移除
    // 2. 使用requestAnimationFrame优化性能
    // 3. 确保松开鼠标时停止拖动
    
    const dragHandlers = {
        // 开始拖动
        mouseDown: function(e) {
            if (scale > 1) {
                e.preventDefault(); // 防止拖动图片时浏览器的默认行为
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                modalImg.style.cursor = 'grabbing';
                
                // 立即添加document级别的事件监听器
                document.addEventListener('mousemove', dragHandlers.mouseMove, { passive: false });
                document.addEventListener('mouseup', dragHandlers.mouseUp);
                
                // 添加额外的保障措施，确保拖动状态能被正确重置
                window.addEventListener('blur', dragHandlers.stopDragging);
                document.addEventListener('mouseleave', dragHandlers.stopDragging);
            }
        },
        
        // 拖动中
        mouseMove: function(e) {
            if (!isDragging) return; // 确保只有在isDragging为true时才处理
            
            e.preventDefault(); // 阻止默认行为，防止拖动过程中选择文本等
            
            // 使用requestAnimationFrame优化性能，减少拖动延迟
            requestAnimationFrame(() => {
                if (!isDragging) return; // 再次检查，防止拖动状态在动画帧之间被更改
                
                // 计算新的位置
                const newTranslateX = e.clientX - startX;
                const newTranslateY = e.clientY - startY;
                
                // 获取图片和视窗的尺寸
                const imgRect = modalImg.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                // 计算缩放后的图片尺寸
                const scaledWidth = imgRect.width * scale;
                const scaledHeight = imgRect.height * scale;
                
                // 计算允许的最大拖动距离（确保图片不会完全拖出视窗）
                const maxX = (scaledWidth - viewportWidth) / 2 + 100; // 添加一些余量
                const maxY = (scaledHeight - viewportHeight) / 2 + 100;
                
                // 应用拖动限制，但只在图片大于视窗时
                if (scaledWidth > viewportWidth) {
                    translateX = Math.min(maxX, Math.max(-maxX, newTranslateX));
                } else {
                    translateX = newTranslateX;
                }
                
                if (scaledHeight > viewportHeight) {
                    translateY = Math.min(maxY, Math.max(-maxY, newTranslateY));
                } else {
                    translateY = newTranslateY;
                }
                
                updateTransform();
            });
        },
        
        // 结束拖动
        mouseUp: function(e) {
            dragHandlers.stopDragging();
        },
        
        // 停止拖动的通用方法，确保所有事件都能触发停止
        stopDragging: function() {
            if (isDragging) {
                isDragging = false;
                modalImg.style.cursor = scale > 1 ? 'grab' : 'auto';
                
                // 移除所有事件监听器
                document.removeEventListener('mousemove', dragHandlers.mouseMove, { passive: false });
                document.removeEventListener('mouseup', dragHandlers.mouseUp);
                window.removeEventListener('blur', dragHandlers.stopDragging);
                document.removeEventListener('mouseleave', dragHandlers.stopDragging);
            }
        }
    };
    
    // 只在图片上添加mousedown事件，其他事件在document级别处理
    modalImg.addEventListener('mousedown', dragHandlers.mouseDown);
    
    // 更新图片变换 - 使用translate3d触发GPU加速
    function updateTransform() {
        if (!isDragging && scale === 1) {
            // 如果不在拖动状态且缩放为1，重置变换
            translateX = 0;
            translateY = 0;
        }
        
        modalImg.style.transform = `scale(${scale}) translate3d(${translateX / scale}px, ${translateY / scale}px, 0)`;
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
});