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
    
    // 打开模态框函数
    function openModal(imgSrc) {
        modal.style.display = 'flex';
        modalImg.src = imgSrc;
        document.body.style.overflow = 'hidden'; // 防止背景滚动
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
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}); 