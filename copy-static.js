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
    
    // スタンドアロンディレクトリが存在するか確認
    if (!(await fs.pathExists(standaloneDir))) {
      console.log('❌ スタンドアロンビルドが見つかりません。next.config.mjsでoutput: "standalone"が設定されているか確認してください。');
      return;
    }
    
    // Publicディレクトリをコピー
    if (await fs.pathExists(publicSrc)) {
      await fs.copy(publicSrc, publicDest, { overwrite: true });
      console.log('✅ publicディレクトリをコピーしました');
      
      // 重要なファイルが存在するか確認
      const logoPath = path.join(publicDest, 'imabarione.png');
      if (await fs.pathExists(logoPath)) {
        console.log('✅ ロゴファイル(imabarione.png)をコピーしました');
      }
      
      // 画像ファイルが正しくコピーされたか確認
      const imagesSrc = path.join(publicSrc, 'images');
      const imagesDest = path.join(publicDest, 'images');
      if (await fs.pathExists(imagesSrc)) {
        await fs.copy(imagesSrc, imagesDest, { overwrite: true });
        const imageFiles = await fs.readdir(imagesDest);
        console.log(`✅ ${imageFiles.length}個の画像ファイルをコピーしました`);
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
    
    console.log('🎉 静的ファイルのコピーが完了しました！');
  } catch (error) {
    console.error('❌ 静的ファイルのコピー中にエラーが発生しました:', error);
    process.exit(1);
  }
}

copyStatic();
