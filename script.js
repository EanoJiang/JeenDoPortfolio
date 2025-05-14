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
    
    // 动态生成画廊项目
    photoData.forEach(photo => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.title;
        img.className = 'gallery-img';
        
        const caption = document.createElement('div');
        caption.className = 'gallery-caption';
        caption.textContent = photo.title;
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(caption);
        gallery.appendChild(galleryItem);
        
        // 为每个画廊项目添加点击事件，打开模态框
        galleryItem.addEventListener('click', function() {
            openModal(photo.src);
        });
    });
    
    // 获取模态框元素
    const modal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.getElementsByClassName('close')[0];
    
    // 图片缩放变量
    let scale = 1;
    const scaleStep = 0.1;
    const minScale = 0.5;
    const maxScale = 3;
    
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
    }
    
    // 添加鼠标滚轮事件监听
    modal.addEventListener('wheel', function(event) {
        event.preventDefault();
        
        // 确定缩放方向
        const delta = Math.sign(event.deltaY) * -1;
        
        // 记录缩放前的比例
        const prevScale = scale;
        
        // 计算新的缩放比例
        if (delta > 0) {
            // 放大
            scale = Math.min(scale + scaleStep, maxScale);
        } else {
            // 缩小
            scale = Math.max(scale - scaleStep, minScale);
        }
        
        // 应用缩放
        updateTransform();
    });
    
    // 鼠标按下事件，开始拖动
    modalImg.addEventListener('mousedown', function(event) {
        // 只有在放大状态才能拖动
        if (scale > 1) {
            isDragging = true;
            startX = event.clientX - translateX;
            startY = event.clientY - translateY;
            modalImg.style.cursor = 'grabbing';
        }
    });
    
    // 鼠标移动事件，实时更新位置
    modal.addEventListener('mousemove', function(event) {
        if (isDragging) {
            event.preventDefault();
            translateX = event.clientX - startX;
            translateY = event.clientY - startY;
            updateTransform();
        }
    });
    
    // 鼠标释放事件，结束拖动
    window.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            modalImg.style.cursor = 'grab';
        }
    });
    
    // 鼠标进入图片区域，如果已缩放则显示抓取光标
    modalImg.addEventListener('mouseenter', function() {
        if (scale > 1) {
            modalImg.style.cursor = 'grab';
        }
    });
    
    // 鼠标离开图片区域
    modalImg.addEventListener('mouseleave', function() {
        modalImg.style.cursor = 'default';
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}); 