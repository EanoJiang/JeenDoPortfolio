const fs = require('fs');
const path = require('path');

// 配置项
const photoDir = 'photo';
const scriptFile = 'script.js';
const fullscreenFile = 'fullscreen.html';
const scriptArrayStartMarker = '    const photoData = [';
const scriptArrayEndMarker = '    ];';
const fullscreenArrayStartMarker = '            // 手动定义照片数组结构\n            const photoData = [';
const fullscreenArrayEndMarker = '            ];';

// 获取照片目录中的所有文件
function getPhotoFiles() {
    try {
        const files = fs.readdirSync(photoDir);
        return files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        });
    } catch (error) {
        console.error(`读取照片目录失败: ${error.message}`);
        return [];
    }
}

// 生成脚本文件中的照片数组项
function generateScriptPhotoEntry(file) {
    const filePath = `${photoDir}/${file}`;
    const title = file
        .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')  // 移除文件扩展名
        .replace(/^\d+\./, '')  // 移除开头的数字和点
        .replace(/\d+$/, '')  // 移除末尾的数字
        .replace(/\s+/g, ' ')  // 规范化空格
        .trim();  // 移除首尾空格
        
    return `        { src: '${filePath}', title: '${title}' }`;
}

// 生成fullscreen.html中的照片数组项
function generateFullscreenPhotoEntry(file) {
    const filePath = `${photoDir}/${file}`;
    const title = file
        .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')  // 移除文件扩展名
        .replace(/^\d+\./, '')  // 移除开头的数字和点
        .replace(/\d+$/, '')  // 移除末尾的数字
        .replace(/\s+/g, ' ')  // 规范化空格
        .trim();  // 移除首尾空格
        
    return `                { src: '${filePath}', title: '${title}' }`;
}

// 更新脚本文件
function updateScriptFile(photoEntries) {
    try {
        // 读取原始脚本文件
        let scriptContent = fs.readFileSync(scriptFile, 'utf8');
        
        // 查找数组开始和结束的位置
        const startIndex = scriptContent.indexOf(scriptArrayStartMarker);
        const endIndex = scriptContent.indexOf(scriptArrayEndMarker, startIndex);
        
        if (startIndex === -1 || endIndex === -1) {
            throw new Error('无法在脚本中找到照片数组');
        }
        
        // 替换数组内容
        const newArrayContent = scriptArrayStartMarker + '\n' + 
                                photoEntries.join(',\n') + '\n' + 
                                scriptArrayEndMarker;
        
        const newScriptContent = scriptContent.substring(0, startIndex) + 
                                 newArrayContent + 
                                 scriptContent.substring(endIndex + scriptArrayEndMarker.length);
        
        // 写入更新后的内容
        fs.writeFileSync(scriptFile, newScriptContent);
        console.log(`已成功更新 ${scriptFile} 中的照片数组，共 ${photoEntries.length} 张照片`);
        return true;
    } catch (error) {
        console.error(`更新脚本文件失败: ${error.message}`);
        return false;
    }
}

// 更新fullscreen.html文件
function updateFullscreenFile(photoEntries) {
    try {
        // 检查文件是否存在
        if (!fs.existsSync(fullscreenFile)) {
            console.log(`${fullscreenFile} 文件不存在，跳过更新`);
            return false;
        }
        
        // 读取原始fullscreen.html文件
        let fullscreenContent = fs.readFileSync(fullscreenFile, 'utf8');
        
        // 查找数组开始和结束的位置
        const startIndex = fullscreenContent.indexOf(fullscreenArrayStartMarker);
        const endIndex = fullscreenContent.indexOf(fullscreenArrayEndMarker, startIndex);
        
        if (startIndex === -1 || endIndex === -1) {
            throw new Error(`无法在 ${fullscreenFile} 中找到照片数组`);
        }
        
        // 替换数组内容
        const newArrayContent = fullscreenArrayStartMarker + '\n' + 
                                photoEntries.join(',\n') + '\n' + 
                                fullscreenArrayEndMarker;
        
        const newFullscreenContent = fullscreenContent.substring(0, startIndex) + 
                                    newArrayContent + 
                                    fullscreenContent.substring(endIndex + fullscreenArrayEndMarker.length);
        
        // 写入更新后的内容
        fs.writeFileSync(fullscreenFile, newFullscreenContent);
        console.log(`已成功更新 ${fullscreenFile} 中的照片数组，共 ${photoEntries.length} 张照片`);
        return true;
    } catch (error) {
        console.error(`更新 ${fullscreenFile} 文件失败: ${error.message}`);
        return false;
    }
}

// 主函数
function main() {
    console.log('开始扫描照片目录...');
    const photoFiles = getPhotoFiles();
    
    if (photoFiles.length === 0) {
        console.log('未找到照片文件');
        return;
    }
    
    console.log(`找到 ${photoFiles.length} 张照片，正在生成数组...`);
    
    // 为script.js生成照片数组
    const scriptPhotoEntries = photoFiles.map(generateScriptPhotoEntry);
    console.log('正在更新脚本文件...');
    const scriptUpdateSuccess = updateScriptFile(scriptPhotoEntries);
    
    // 为fullscreen.html生成照片数组
    const fullscreenPhotoEntries = photoFiles.map(generateFullscreenPhotoEntry);
    console.log('正在更新全屏展示页面...');
    const fullscreenUpdateSuccess = updateFullscreenFile(fullscreenPhotoEntries);
    
    if (scriptUpdateSuccess && fullscreenUpdateSuccess) {
        console.log('✅ 所有文件更新成功!');
    } else if (scriptUpdateSuccess) {
        console.log('⚠️ 仅更新了脚本文件，全屏展示页面更新失败');
    } else if (fullscreenUpdateSuccess) {
        console.log('⚠️ 仅更新了全屏展示页面，脚本文件更新失败');
    } else {
        console.log('❌ 所有文件更新失败');
    }
}

// 执行主函数
main();