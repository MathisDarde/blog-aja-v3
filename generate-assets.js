const fs = require('fs');
const path = require('path');

// Les dossiers à scanner
const CONFIG = [
  {
    dir: 'public/_assets/flags',
    output: 'lib/image-assets/flags-list.json'
  },
  {
    dir: 'public/_assets/teamlogos',
    output: 'lib/image-assets/clubs-list.json'
  }
];

function generateAssets() {
  CONFIG.forEach(item => {
    const dirPath = path.join(process.cwd(), item.dir);
    
    try {
      if (!fs.existsSync(dirPath)) {
        console.warn(`⚠️ Le dossier ${item.dir} n'existe pas.`);
        return;
      }

      const files = fs.readdirSync(dirPath).filter(file => {
        // Garder uniquement les images, ignorer les fichiers cachés (.DS_Store)
        return /\.(png|jpg|jpeg|svg|webp|avif)$/i.test(file);
      });

      // Créer le dossier de destination si besoin
      const outputDir = path.dirname(path.join(process.cwd(), item.output));
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Écrire le fichier JSON
      fs.writeFileSync(
        path.join(process.cwd(), item.output),
        JSON.stringify(files, null, 2)
      );

      console.log(`✅ ${files.length} fichiers trouvés dans ${item.dir} -> écrits dans ${item.output}`);
    } catch (err) {
      console.error(`❌ Erreur pour ${item.dir}:`, err);
    }
  });
}

generateAssets();