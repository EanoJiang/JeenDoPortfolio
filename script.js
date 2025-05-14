document.addEventListener('DOMContentLoaded', function() {
    // 照片数据数组
    const photoData = [
        { src: 'photo/wtf2024.jpg', title: '超现实视觉 2024' },
        { src: 'photo/wtf2024(1).jpg', title: '超现实视觉 2024变体' },
        { src: 'photo/wtf2021.jpg', title: '超现实视觉 2021' },
        { src: 'photo/wtf 2021.jpg', title: '超现实视觉 2021原版' },
        { src: 'photo/wtf 2019.jpg', title: '超现实视觉 2019' },
        { src: 'photo/7.米国声音：利润收割者 1080.jpg', title: '利润收割者' },
        { src: 'photo/we\'re the boss . (2).jpg', title: '我们是老板' },
        { src: 'photo/we\'re the boss .SHREDDER.jpg', title: '老板系列：碎纸机' },
        { src: 'photo/we\'re the boss .lady SHREDDER.jpg', title: '女战士系列' },
        { src: 'photo/lady soldier choose weapon .jpg', title: '武器选择' },
        { src: 'photo/lady soldier submashine gun（1）.jpg', title: '女战士：冲锋枪' },
        { src: 'photo/shredder!.jpg', title: '碎纸机！' },
        { src: 'photo/7.fucking soldier.jpg', title: '战士系列' },
        { src: 'photo/6.Mother America fucker.jpg', title: '美国母亲' },
        { src: 'photo/6.2035.jpg', title: '2035未来视角' },
        { src: 'photo/5.2035.jpg', title: '2035视角二' },
        { src: 'photo/4.2035.jpg', title: '2035视角三' },
        { src: 'photo/3.capital Absorbing assets.jpg', title: '资本吸收资产' },
        { src: 'photo/2.CNcapital.jpg', title: '中国资本' },
        { src: 'photo/1.CNcapital.jpg', title: '中国资本二' },
        { src: 'photo/01.FED hunter.jpg', title: '联邦猎人' },
        { src: 'photo/7.brain washed bastard.jpg', title: '洗脑系列' },
        { src: 'photo/everbody wish.jpg', title: '每个人的愿望' },
        { src: 'photo/7.DEATH MEATL.jpg', title: '死亡金属' },
        { src: 'photo/0.震东 (3).jpg', title: '个人肖像' }
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
    
    // 图片缩放变量
    let scale = 1;
    const scaleStep = 0.1;
    const minScale = 0.5;
    
    // 图片拖动变量
    let isDragging = false;
    let startX, startY;
    let translateX = 0;
    let translateY = 0;
    
    // 打开模态框函数
    function openModal(imgSrc) {
        modal.style.display = 'flex';
        modalImg.src = imgSrc;
        // 重置缩放比例和位置
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
    
    // 更新图片变换
    function updateTransform() {
        modalImg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    }
    
    // 确保图片始终在视窗中央，不会被拖出视野
    function constrainPosition() {
        // 获取图片和模态框的尺寸
        const imgRect = modalImg.getBoundingClientRect();
        const modalRect = modal.getBoundingClientRect();
        
        // 计算图片缩放后的实际尺寸
        const scaledWidth = imgRect.width;
        const scaledHeight = imgRect.height;
        
        // 计算图片中心点到模态框中心点的最大距离
        const maxX = Math.max(0, (scaledWidth - modalRect.width) / 2);
        const maxY = Math.max(0, (scaledHeight - modalRect.height) / 2);
        
        // 限制拖动范围
        translateX = Math.min(maxX, Math.max(-maxX, translateX));
        translateY = Math.min(maxY, Math.max(-maxY, translateY));
    }
    
    // 关闭模态框
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // 关闭模态框函数
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // 恢复背景滚动
        
        // 清理模态框中的图片缓存
        clearImageCache(modalImg);
        
        // 重置变量
        scale = 1;
        translateX = 0;
        translateY = 0;
    }
    
    // 清理图片缓存的函数
    function clearImageCache(imgElement) {
        if (imgElement && imgElement.src) {
            // 创建一个新的空白图片URL来替换当前URL
            const blankData = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            
            // 先将图片指向一个1x1的透明gif，这有助于释放原始图片的内存
            imgElement.src = blankData;
            
            // 然后完全移除src属性
            setTimeout(() => {
                imgElement.removeAttribute('src');
            }, 100);
        }
    }
    
    // 更新鼠标滚轮事件
    modal.addEventListener('wheel', function(event) {
        event.preventDefault();
        
        // 确定缩放方向
        const delta = Math.sign(event.deltaY) * -1;
        
        // 记录缩放前的比例
        const prevScale = scale;
        
        // 动态调整缩放步长，缩放倍数越大步长越大，提供更好的用户体验
        let dynamicScaleStep = scaleStep;
        if (scale > 5) {
            // 大于5倍缩放时，增大缩放步长
            dynamicScaleStep = scaleStep * (1 + scale / 20);
        }
        
        // 计算新的缩放比例
        if (delta > 0) {
            // 放大 - 移除最大限制，允许无限放大
            scale = scale + dynamicScaleStep;
            
            // 非常大的缩放值可能导致性能问题，可以在这里添加合理的性能优化
            if (scale > 50) {
                // 在超大缩放时提供视觉反馈
                modalImg.style.imageRendering = 'pixelated';
            } else {
                modalImg.style.imageRendering = 'auto';
            }
        } else {
            // 缩小 - 保留最小限制，防止图片变得太小
            scale = Math.max(scale - dynamicScaleStep, minScale);
            modalImg.style.imageRendering = 'auto';
        }
        
        // 如果缩小到最小或接近最小比例，重置位置到中心
        if (scale <= minScale + 0.1) {
            translateX = 0;
            translateY = 0;
        } else {
            // 缩放后确保图片位置约束
            constrainPosition();
        }
        
        // 更新缩放比例显示（如果想要添加显示当前缩放倍数）
        updateZoomLevel(scale);
        
        updateTransform();
    });
    
    // 显示当前缩放级别
    function updateZoomLevel(scale) {
        // 如果网页中有显示缩放级别的元素，可以在这里更新
        const zoomLevelElement = document.querySelector('.zoom-level');
        if (zoomLevelElement) {
            zoomLevelElement.textContent = `${Math.round(scale * 100)}%`;
        }
        
        // 在控制台打印当前缩放倍数，便于调试
        console.log(`Current zoom: ${scale.toFixed(2)}x`);
    }
    
    // 鼠标按下事件，开始拖动
    modalImg.addEventListener('mousedown', function(event) {
        // 只有在放大状态才能拖动
        if (scale > 1) {
            event.preventDefault(); // 防止默认行为
            isDragging = true;
            startX = event.clientX - translateX;
            startY = event.clientY - translateY;
            modalImg.style.cursor = 'grabbing';
            
            // 监听鼠标移动事件, 但只在当前拖动过程中有效
            const handleMouseMove = function(moveEvent) {
                if (isDragging) {
                    moveEvent.preventDefault();
                    translateX = moveEvent.clientX - startX;
                    translateY = moveEvent.clientY - startY;
                    
                    // 确保图片位置约束
                    constrainPosition();
                    updateTransform();
                }
            };
            
            // 监听鼠标释放事件，结束拖动
            const handleMouseUp = function() {
                if (isDragging) {
                    isDragging = false;
                    modalImg.style.cursor = 'grab';
                    
                    // 拖动结束后移除临时事件监听器
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                }
            };
            
            // 添加临时事件监听器
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    });
    
    // 模态框内拖动处理
    modal.addEventListener('mousemove', function(event) {
        // 只在按下鼠标时移动，这是一个保险措施
        if (isDragging && scale > 1) {
            event.preventDefault();
        }
    });
    
    // 鼠标进入图片区域，如果已缩放则显示抓取光标
    modalImg.addEventListener('mouseenter', function() {
        if (scale > 1) {
            modalImg.style.cursor = 'grab';
        } else {
            modalImg.style.cursor = 'default';
        }
    });
    
    // 鼠标离开图片区域
    modalImg.addEventListener('mouseleave', function() {
        if (!isDragging) {
            modalImg.style.cursor = 'default';
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
    
    // 页面关闭或刷新前的清理工作
    window.addEventListener('beforeunload', function() {
        // 清理加载的图片缓存
        const galleryImages = document.querySelectorAll('.gallery-img');
        galleryImages.forEach(img => {
            clearImageCache(img);
        });
        
        // 清理模态框中的图片
        clearImageCache(modalImg);
        
        // 重置变量
        scale = 1;
        translateX = 0;
        translateY = 0;
        isDragging = false;
        
        // 清空缓存跟踪
        loadedImages.clear();
        
        // 显示缓存已清理的消息
        showCacheStatus('图片缓存已清理');
        
        // 强制浏览器执行垃圾回收（尽管浏览器有自己的垃圾回收机制）
        if (window.gc) {
            window.gc();
        }
        
        // 清除所有事件监听器（在实际应用中可能需要更具体的处理）
        modalImg.onload = null;
        modalImg.onerror = null;
    });

    // 显示缓存状态信息
    function showCacheStatus(message) {
        const cacheStatus = document.getElementById('cacheStatus');
        if (cacheStatus) {
            cacheStatus.textContent = message;
            cacheStatus.style.display = 'block';
            
            // 2秒后自动隐藏
            setTimeout(() => {
                cacheStatus.style.display = 'none';
            }, 2000);
        }
    }

    // 当用户离开页面一段时间后再回来，主动清理未使用的缓存
    let pageVisibilityTimer;
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 页面隐藏（用户切换到其他标签页或最小化浏览器）
            pageVisibilityTimer = setTimeout(() => {
                // 超过10分钟未使用，清理部分缓存
                const unusedImages = [];
                loadedImages.forEach(src => {
                    if (!document.querySelector(`img[src="${src}"]`)) {
                        unusedImages.push(src);
                    }
                });
                
                // 从缓存集合中移除未使用的图片
                unusedImages.forEach(src => {
                    loadedImages.delete(src);
                });
                
                if (unusedImages.length > 0) {
                    showCacheStatus(`已清理${unusedImages.length}张未使用的图片缓存`);
                }
            }, 10 * 60 * 1000); // 10分钟
        } else {
            // 页面可见（用户回到本页面）
            clearTimeout(pageVisibilityTimer);
        }
    });
}); 