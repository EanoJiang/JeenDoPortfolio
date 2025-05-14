// 照片数组生成脚本
const fs = require('fs');
const path = require('path');

// 照片文件夹路径
const photoDir = path.join(__dirname, 'photo');

// 照片组织结构 - 用于分类照片的规则
const photoGroups = [
    { name: '超现实视觉系列', pattern: /wtf|超现实/i },
    { name: '2035未来系列', pattern: /2035/i },
    { name: '资本系列', pattern: /capital|CNcapital|FED|收割者/i },
    { name: '老板系列', pattern: /boss|SHREDDER|碎纸机/i },
    { name: '战士系列', pattern: /soldier|fucking|Mother America/i },
    { name: '其他作品', pattern: /.*/ }  // 默认分类
];

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
        
        // 按文件名排序
        imageFiles.sort((a, b) => a.localeCompare(b));
        
        return imageFiles;
    } catch (error) {
        console.error('无法读取照片目录:', error.message);
        return [];
    }
}

// 根据文件名确定图片分组
function determineGroup(filename) {
    for (const group of photoGroups) {
        if (group.pattern.test(filename)) {
            return group.name;
        }
    }
    return '其他作品';  // 默认分组
}

// 生成照片数组
function generatePhotoArray() {
    const photos = getPhotoFiles();
    const groupedPhotos = {};
    
    // 初始化分组
    photoGroups.forEach(group => {
        groupedPhotos[group.name] = [];
    });
    
    // 分组照片
    photos.forEach(photo => {
        const group = determineGroup(photo);
        const title = generateTitle(photo);
        groupedPhotos[group].push({
            src: `photo/${photo}`,
            title: title,
            filename: photo // 保存原始文件名用于排序
        });
    });
    
    // 确保每个分组内的照片也按文件名排序
    Object.keys(groupedPhotos).forEach(group => {
        groupedPhotos[group].sort((a, b) => a.filename.localeCompare(b.filename));
    });
    
    return groupedPhotos;
}

// 生成JavaScript代码
function generateCode() {
    const groupedPhotos = generatePhotoArray();
    let code = `// 此代码由自动脚本生成于 ${new Date().toLocaleString()}\n`;
    code += `document.addEventListener('DOMContentLoaded', function() {\n`;
    code += `    // 照片数据数组\n`;
    code += `    const photoData = [\n`;
    
    // 合并所有照片数组
    let allPhotos = [];
    Object.entries(groupedPhotos).forEach(([groupName, photos]) => {
        if (photos.length > 0) {
            code += `        // ${groupName}\n`;
            photos.forEach(photo => {
                // 处理可能包含单引号的文件名
                const safeFilename = photo.src.replace(/'/g, "\\'");
                code += `        { src: '${safeFilename}', title: '${photo.title}' },\n`;
                allPhotos.push({
                    src: photo.src,
                    title: photo.title
                });
            });
        }
    });
    
    code += `    ];\n`;
    
    // 生成剩余的代码（保持与原始脚本的一致性）
    const restOfCode = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8')
        .split('document.addEventListener(\'DOMContentLoaded\', function() {')[1]
        .split('const photoData = [')[1]
        .split('];')[1];
    
    code += restOfCode;
    
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