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
    }
    
    // _next/staticディレクトリをコピー
    if (await fs.pathExists(staticSrc)) {
      await fs.copy(staticSrc, staticDest, { overwrite: true });
      console.log('✅ _next/staticディレクトリをコピーしました');
    }
    
    console.log('🎉 静的ファイルのコピーが完了しました！');
  } catch (error) {
    console.error('❌ 静的ファイルのコピー中にエラーが発生しました:', error);
    process.exit(1);
  }
}

copyStatic();
