'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { fetchModels, streamChatCompletion, type Model, type ChatMessage } from '@/lib/api'
import { designStyles, getDesignStyleById } from '@/lib/design-styles'
import { parseGeneratedCode, exportAsZip, createPreviewHTML, type ProjectFile } from '@/lib/utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { 
  Download, 
  Eye, 
  Palette, 
  Send, 
  Loader2, 
  ExternalLink,
  Edit3,
  FileText
} from 'lucide-react'

interface GeneratedProject {
  files: ProjectFile[]
  originalPrompt: string
  selectedModel: string
  selectedDesign: string
}

export default function GenifyApp() {
  // State management
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [selectedDesign, setSelectedDesign] = useState<string>('minimalistic')
  const [prompt, setPrompt] = useState<string>('')
  const [followUpPrompt, setFollowUpPrompt] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [isFollowingUp, setIsFollowingUp] = useState<boolean>(false)
  const [generatedCode, setGeneratedCode] = useState<string>('')
  const [currentProject, setCurrentProject] = useState<GeneratedProject | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  // Modal states
  const [isDesignModalOpen, setIsDesignModalOpen] = useState<boolean>(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false)
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false)
  
  // Refs
  const codeEndRef = useRef<HTMLDivElement>(null)

  // Load models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('🔄 Genify: Fetching models...')
        const fetchedModels = await fetchModels()
        console.log('✅ Genify: Models fetched:', fetchedModels)
        setModels(fetchedModels)
        if (fetchedModels.length > 0) {
          setSelectedModel(fetchedModels[0].id)
        }
      } catch (error) {
        console.error('❌ Genify: Error loading models:', error)
        // Fallback: set a default model for testing
        const fallbackModel = { id: 'longcat-chat', object: 'model', created: 0, owned_by: 'longcat' }
        setModels([fallbackModel])
        setSelectedModel('longcat-chat')
      } finally {
        setIsLoading(false)
      }
    }
    
    // Add a small delay to ensure proper hydration
    const timer = setTimeout(loadModels, 100)
    return () => clearTimeout(timer)
  }, [])

  // Auto-scroll to bottom of generated code
  useEffect(() => {
    if (codeEndRef.current) {
      codeEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [generatedCode])

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedModel) return

    setIsGenerating(true)
    setGeneratedCode('')
    setCurrentProject(null)

    try {
      const designStyle = getDesignStyleById(selectedDesign)
      const systemPrompt = `You are an expert web developer. Generate complete, production-ready web applications based on user requirements.

${designStyle?.systemPrompt || 'Create a clean, minimalistic design.'}

Requirements:
1. Generate complete HTML, CSS, and JavaScript files
2. Make the code mobile-responsive
3. Use modern web standards and best practices
4. Include proper file structure with clear file names
5. Format code blocks with proper language tags and file names like this:
   \`\`\`html
   // index.html
   [HTML code here]
   \`\`\`
   
   \`\`\`css
   // styles.css
   [CSS code here]
   \`\`\`
   
   \`\`\`javascript
   // script.js
   [JavaScript code here]
   \`\`\`

6. Make sure all files work together seamlessly
7. Add comments in the code for clarity
8. Ensure the application is fully functional

Generate a complete web application for: ${prompt}`

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]

      let fullResponse = ''
      for await (const chunk of streamChatCompletion(selectedModel, messages)) {
        fullResponse += chunk
        setGeneratedCode(fullResponse)
      }

      // Parse the generated code into files
      const files = parseGeneratedCode(fullResponse)
      if (files.length > 0) {
        setCurrentProject({
          files,
          originalPrompt: prompt,
          selectedModel,
          selectedDesign
        })
      }
    } catch (error) {
      console.error('Error generating code:', error)
      setGeneratedCode('Error generating code. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFollowUp = async () => {
    if (!followUpPrompt.trim() || !selectedModel || !currentProject) return

    setIsFollowingUp(true)
    const previousCode = generatedCode

    try {
      const designStyle = getDesignStyleById(selectedDesign)
      const systemPrompt = `You are an expert web developer. The user has requested modifications to an existing web application.

${designStyle?.systemPrompt || 'Maintain a clean, minimalistic design.'}

IMPORTANT: You must modify the existing code based on the user's request. Here's the current project:

${previousCode}

Requirements for modifications:
1. Make the requested changes while maintaining the existing functionality
2. Keep the same file structure unless specifically asked to change it
3. Ensure all files still work together after modifications
4. Format code blocks with proper language tags and file names
5. Only show the complete updated files that were changed
6. Maintain mobile responsiveness
7. Use modern web standards and best practices

User's modification request: ${followUpPrompt}`

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: followUpPrompt }
      ]

      let fullResponse = ''
      for await (const chunk of streamChatCompletion(selectedModel, messages)) {
        fullResponse += chunk
        setGeneratedCode(previousCode + '\n\n--- MODIFICATIONS ---\n\n' + fullResponse)
      }

      // Parse the new code and update the project
      const newFiles = parseGeneratedCode(fullResponse)
      if (newFiles.length > 0) {
        // Merge with existing files or replace them
        const updatedFiles = [...currentProject.files]
        newFiles.forEach(newFile => {
          const existingIndex = updatedFiles.findIndex(f => f.name === newFile.name)
          if (existingIndex >= 0) {
            updatedFiles[existingIndex] = newFile
          } else {
            updatedFiles.push(newFile)
          }
        })

        setCurrentProject({
          ...currentProject,
          files: updatedFiles
        })
      }
    } catch (error) {
      console.error('Error in follow-up:', error)
      setGeneratedCode(previousCode + '\n\nError applying modifications. Please try again.')
    } finally {
      setIsFollowingUp(false)
      setFollowUpPrompt('')
    }
  }

  const handleExportZip = () => {
    if (currentProject) {
      exportAsZip(currentProject.files, 'genify-project')
    }
  }

  const handlePreview = () => {
    setIsPreviewModalOpen(true)
  }

  const handleDeployToVercel = () => {
    // Open Vercel deployment page
    window.open('https://vercel.com/new', '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Genify</h2>
          <p className="text-gray-600">Initializing AI models...</p>
        </div>
      </div>
    )
  }

  const modelOptions = models.map(model => ({
    value: model.id,
    label: `${model.id} (${model.owned_by})`
  }))

  const designOptions = designStyles.map(style => ({
    value: style.id,
    label: style.name
  }))

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Genify</h1>
          <p className="text-gray-600 text-lg">AI-powered web application generator</p>
          <div className="mt-2 text-sm text-green-600">✅ Interactive Mode Active</div>
        </div>

        {/* Main Input Section */}
        <div className="space-y-6 mb-8">
          {/* Model and Design Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Model ({models.length} available)
              </label>
              <Select
                options={modelOptions}
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Design Style
              </label>
              <div className="flex gap-2">
                <Select
                  options={designOptions}
                  value={selectedDesign}
                  onChange={(e) => setSelectedDesign(e.target.value)}
                  disabled={isGenerating}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setIsDesignModalOpen(true)}
                  disabled={isGenerating}
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your web application
            </label>
            <Textarea
              placeholder="e.g., Create a todo list app with dark theme, user authentication, and the ability to add, edit, and delete tasks..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              className="min-h-[120px]"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim() || !selectedModel}
            className="w-full h-12 text-base"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Generate Application
              </>
            )}
          </Button>
        </div>

        {/* Generated Code Display */}
        {generatedCode && (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Generated Code</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCodeModalOpen(true)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View Files
                  </Button>
                  {currentProject && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreview}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportZip}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export ZIP
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeployToVercel}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Deploy
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="max-h-96 overflow-auto">
                <SyntaxHighlighter
                  language="markdown"
                  style={oneLight}
                  customStyle={{
                    margin: 0,
                    background: 'white',
                    fontSize: '14px',
                  }}
                >
                  {generatedCode}
                </SyntaxHighlighter>
              </div>
              <div ref={codeEndRef} />
            </div>

            {/* Follow-up Section */}
            {currentProject && !isGenerating && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Make Changes
                </h4>
                <div className="space-y-3">
                  <Textarea
                    placeholder="e.g., Add a search feature, change the color scheme to blue, make the buttons larger..."
                    value={followUpPrompt}
                    onChange={(e) => setFollowUpPrompt(e.target.value)}
                    disabled={isFollowingUp}
                    className="min-h-[80px]"
                  />
                  <Button
                    onClick={handleFollowUp}
                    disabled={isFollowingUp || !followUpPrompt.trim()}
                    className="w-full"
                  >
                    {isFollowingUp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Applying Changes...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Apply Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Design Styles Modal */}
        <Modal
          isOpen={isDesignModalOpen}
          onClose={() => setIsDesignModalOpen(false)}
          title="Choose Design Style"
          className="max-w-4xl"
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {designStyles.map((style) => (
                <div
                  key={style.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedDesign === style.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedDesign(style.id)
                    setIsDesignModalOpen(false)
                  }}
                >
                  <h3 className="font-medium text-gray-900 mb-2">{style.name}</h3>
                  <p className="text-sm text-gray-600">{style.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        {/* Preview Modal */}
        <Modal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          title="Preview"
          className="max-w-6xl"
        >
          <div className="p-6">
            {currentProject && (
              <iframe
                srcDoc={createPreviewHTML(currentProject.files)}
                className="w-full h-[600px] border border-gray-200 rounded-md"
                title="Preview"
              />
            )}
          </div>
        </Modal>

        {/* Code Files Modal */}
        <Modal
          isOpen={isCodeModalOpen}
          onClose={() => setIsCodeModalOpen(false)}
          title="Project Files"
          className="max-w-4xl"
        >
          <div className="p-6">
            {currentProject && (
              <div className="space-y-4">
                {currentProject.files.map((file, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900">{file.name}</h4>
                    </div>
                    <SyntaxHighlighter
                      language={file.type === 'js' ? 'javascript' : file.type}
                      style={oneLight}
                      customStyle={{
                        margin: 0,
                        maxHeight: '300px',
                        fontSize: '14px',
                      }}
                    >
                      {file.content}
                    </SyntaxHighlighter>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  )
}