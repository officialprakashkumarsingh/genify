import { type ClassValue, clsx } from 'clsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export interface ProjectFile {
  name: string;
  content: string;
  type: 'html' | 'css' | 'js' | 'json' | 'md' | 'other';
}

export function detectFileType(filename: string): ProjectFile['type'] {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return 'js';
    case 'json':
      return 'json';
    case 'md':
      return 'md';
    default:
      return 'other';
  }
}

export function parseGeneratedCode(content: string): ProjectFile[] {
  const files: ProjectFile[] = [];
  const codeBlockRegex = /```(\w+)?\s*(?:\/\/\s*(.+?)\s*)?\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const [, language, filename, code] = match;
    
    if (filename && code.trim()) {
      files.push({
        name: filename.trim(),
        content: code.trim(),
        type: detectFileType(filename.trim())
      });
    } else if (code.trim()) {
      // If no filename is specified, try to infer from language
      let inferredName = 'index.html';
      if (language === 'css') inferredName = 'styles.css';
      else if (language === 'javascript' || language === 'js') inferredName = 'script.js';
      else if (language === 'json') inferredName = 'package.json';
      
      files.push({
        name: inferredName,
        content: code.trim(),
        type: detectFileType(inferredName)
      });
    }
  }

  // If no files were parsed, treat the entire content as HTML
  if (files.length === 0 && content.trim()) {
    files.push({
      name: 'index.html',
      content: content.trim(),
      type: 'html'
    });
  }

  return files;
}

export async function exportAsZip(files: ProjectFile[], projectName: string = 'genify-project') {
  const zip = new JSZip();

  files.forEach(file => {
    zip.file(file.name, file.content);
  });

  try {
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${projectName}.zip`);
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    throw new Error('Failed to create ZIP file');
  }
}

export function getLanguageFromFileType(type: ProjectFile['type']): string {
  switch (type) {
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'js':
      return 'javascript';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    default:
      return 'text';
  }
}

export function createPreviewHTML(files: ProjectFile[]): string {
  const htmlFile = files.find(f => f.type === 'html');
  const cssFiles = files.filter(f => f.type === 'css');
  const jsFiles = files.filter(f => f.type === 'js');

  if (!htmlFile) {
    return '<html><body><p>No HTML file found in the generated project.</p></body></html>';
  }

  let html = htmlFile.content;

  // Inject CSS files
  if (cssFiles.length > 0) {
    const cssContent = cssFiles.map(f => `<style>${f.content}</style>`).join('\n');
    html = html.replace('</head>', `${cssContent}\n</head>`);
  }

  // Inject JS files
  if (jsFiles.length > 0) {
    const jsContent = jsFiles.map(f => `<script>${f.content}</script>`).join('\n');
    html = html.replace('</body>', `${jsContent}\n</body>`);
  }

  return html;
}