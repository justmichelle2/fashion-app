const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'Medium-Fidelity Mobile App Design(1)', 'src', 'app', 'screens');
const destDir = path.join(__dirname, 'Fashion-app', 'fashion-app', 'src', 'app', 'pages');

const filesToConvert = ['DesignerDashboard.tsx', 'DesignerHome.tsx', 'DesignerList.tsx', 'DesignerProfile.tsx'];

filesToConvert.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file.replace('.tsx', '.jsx'));
  
  if (fs.existsSync(srcPath)) {
    let content = fs.readFileSync(srcPath, 'utf8');
    
    // Convert react-router to react-router-dom
    content = content.replace(/from ["']react-router["']/g, 'from "react-router-dom"');
    
    // Replace ImageWithFallback with img
    content = content.replace(/<ImageWithFallback([\s\S]*?)\/>/g, '<img$1/>');
    content = content.replace(/import { ImageWithFallback }.*?;\n/g, '');
    
    // Replace DrssedLogo
    content = content.replace(/<DrssedLogo([\s\S]*?)\/>/g, '<img src={logo} alt="Drssed Logo" className="w-16 h-16 object-cover rounded-full" />');
    if (content.includes('<DrssedLogo') || content.includes('{logo}')) {
        content = 'import logo from "../../../assets/drssed.jpg";\n' + content;
    }
    content = content.replace(/import { DrssedLogo }.*?;\n/g, '');

    // Card Layout Wrapping
    content = content.replace(/<div className=["']min-h-screen([^>]*?)["']>/, 
      '<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">\n      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden h-[90vh] sm:h-auto pb-4 overflow-y-auto w-full relative">'
    );
    
    const lastDivIndex = content.lastIndexOf('</div>');
    if (lastDivIndex !== -1) {
      content = content.substring(0, lastDivIndex) + '</div>\n    </div>' + content.substring(lastDivIndex + 6);
    }

    fs.writeFileSync(destPath, content, 'utf8');
    console.log('Converted ' + file);
  } else {
    console.log('File not found: ' + file);
  }
});
