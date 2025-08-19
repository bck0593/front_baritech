const fs = require('fs-extra');
const path = require('path');

async function copyStatic() {
  try {
    console.log('🔄 静的ファイルのコピーを開始...');
    
    const standaloneDir = path.join(process.cwd(), '.next/standalone');
    const publicSrc = path.join(process.cwd(), 'public');
    const publicDest = path.join(standaloneDir, 'public');
    const staticSrc = path.join(process.cwd(), '.next/static');
    const staticDest = path.join(standaloneDir, '.next/static');
    
    // Publicディレクトリをコピー
    if (await fs.pathExists(publicSrc)) {
      await fs.copy(publicSrc, publicDest, { overwrite: true });
      console.log('✅ publicディレクトリをコピーしました');
      
      // 画像ファイルが正しくコピーされたか確認
      const imagesSrc = path.join(publicSrc, 'images');
      const imagesDest = path.join(publicDest, 'images');
      if (await fs.pathExists(imagesSrc)) {
        await fs.copy(imagesSrc, imagesDest, { overwrite: true });
        const imageFiles = await fs.readdir(imagesDest);
        console.log(`✅ ${imageFiles.length}個の画像ファイルをコピーしました:`, imageFiles.slice(0, 5).join(', '));
      }
    }
    
    // _next/staticディレクトリをコピー
    if (await fs.pathExists(staticSrc)) {
      await fs.copy(staticSrc, staticDest, { overwrite: true });
      console.log('✅ _next/staticディレクトリをコピーしました');
    }
    
    // server.jsが正しい場所にあることを確認
    const serverJsPath = path.join(standaloneDir, 'server.js');
    if (await fs.pathExists(serverJsPath)) {
      console.log('✅ server.jsが正しい位置にあります');
    } else {
      console.log('❌ server.jsが見つかりません');
    }
    
    // ファイル構造を表示
    console.log('\n📁 Standalone ディレクトリ構造:');
    const files = await fs.readdir(standaloneDir);
    files.forEach(file => console.log(`  - ${file}`));
    
    console.log('🎉 静的ファイルのコピーが完了しました！');
  } catch (error) {
    console.error('❌ 静的ファイルのコピー中にエラーが発生しました:', error);
    process.exit(1);
  }
}

copyStatic();
