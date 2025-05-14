document.addEventListener('DOMContentLoaded', function() {
    // 照片数据数组
    const photoData = [
        { src: 'photo/wtf2024.jpg', title: '超现实视觉 2024' },
        { src: 'photo/wtf2021.jpg', title: '超现实视觉 2021' },
        { src: 'photo/wtf 2019.jpg', title: '超现实视觉 2019' },
        { src: 'photo/7.米国声音：利润收割者 1080.jpg', title: '利润收割者' },
        { src: 'photo/we\'re the boss . (2).jpg', title: '我们是老板' },
        { src: 'photo/6.2035.jpg', title: '2035未来视角' },
        { src: 'photo/we\'re the boss .lady SHREDDER.jpg', title: '女战士系列' },
        { src: 'photo/lady soldier choose weapon .jpg', title: '武器选择' },
        { src: 'photo/shredder!.jpg', title: '碎纸机！' },
        { src: 'photo/7.fucking soldier.jpg', title: '战士系列' },
        { src: 'photo/6.Mother America fucker.jpg', title: '美国母亲' },
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
    
    // 生成查看器页面
    function generateViewerPage() {
        // 创建新的HTML内容
        let viewerContent = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>作品全屏查看</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    background-color: #000;
                    color: #fff;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    overflow-x: hidden;
                }
                
                .viewer-container {
                    width: 100%;
                }
                
                .image-item {
                    width: 100%;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                
                .image-item img {
                    width: 100%;
                    height: auto;
                    max-height: 90vh;
                    object-fit: contain;
                }
                
                .image-title {
                    margin-top: 20px;
                    font-size: 1.5rem;
                    text-align: center;
                    padding: 10px;
                }
                
                .back-button {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background-color: rgba(0,0,0,0.7);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    z-index: 100;
                }
                
                .nav-hints {
                    position: fixed;
                    bottom: 20px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    background-color: rgba(0,0,0,0.7);
                    padding: 10px;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <button class="back-button" onclick="window.close()">返回画廊</button>
            <div class="viewer-container">`;
        
        // 添加所有图片
        photoData.forEach(photo => {
            viewerContent += `
                <div class="image-item">
                    <img src="${photo.src}" alt="${photo.title}">
                    <div class="image-title">${photo.title}</div>
                </div>`;
        });
        
        // 添加底部导航提示和关闭标签
        viewerContent += `
            </div>
            <div class="nav-hints">向下滚动查看更多作品</div>
        </body>
        </html>`;
        
        return viewerContent;
    }
    
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
        
        // 为每个画廊项目添加点击事件，打开新窗口查看图片
        galleryItem.addEventListener('click', function() {
            // 创建一个Blob对象
            const blob = new Blob([generateViewerPage()], {type: 'text/html'});
            const viewerUrl = URL.createObjectURL(blob);
            
            // 打开新窗口并传递索引
            const viewerWindow = window.open(viewerUrl, '_blank');
            
            // 在新窗口加载完成后，滚动到当前点击的图片
            viewerWindow.addEventListener('load', function() {
                const imageItems = viewerWindow.document.querySelectorAll('.image-item');
                if (imageItems[index]) {
                    imageItems[index].scrollIntoView({behavior: 'smooth'});
                }
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
    
    // 页面关闭或刷新前的清理工作
    window.addEventListener('beforeunload', function() {
        // 清理加载的图片缓存
        const galleryImages = document.querySelectorAll('.gallery-img');
        galleryImages.forEach(img => {
            clearImageCache(img);
        });
        
        // 清空缓存跟踪
        loadedImages.clear();
        
        // 显示缓存已清理的消息
        showCacheStatus('图片缓存已清理');
        
        // 强制浏览器执行垃圾回收（尽管浏览器有自己的垃圾回收机制）
        if (window.gc) {
            window.gc();
        }
    });
    
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