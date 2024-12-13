import React, { useState } from 'react';
import { Trash2, Share2, Upload, Download, ChevronRight } from 'lucide-react';

interface File {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<File[]>([
    { id: '1', name: 'document.pdf', size: '2.5 MB', uploadDate: '2023-05-20' },
    { id: '2', name: 'image.jpg', size: '1.8 MB', uploadDate: '2023-05-19' },
    { id: '3', name: 'spreadsheet.xlsx', size: '3.2 MB', uploadDate: '2023-05-18' },
  ]);
  const [sharingFile, setSharingFile] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [isReceiving, setIsReceiving] = useState(false);
  const [receiveStep, setReceiveStep] = useState(1);
  const [receiveEmail, setReceiveEmail] = useState('');
  const [receiveFileName, setReceiveFileName] = useState('');
  const [securityKey1, setSecurityKey1] = useState('');
  const [securityKey2, setSecurityKey2] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic here
    console.log('File uploaded:', event.target.files);
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const handleShare = (id: string) => {
    setSharingFile(id);
    setShareEmail('');
  };

  const handleShareSubmit = () => {
    // Handle share logic here
    console.log('Sharing file', sharingFile, 'with', shareEmail);
    setSharingFile(null);
  };

  const handleReceiveNext = () => {
    // In a real app, you would verify the details with the backend here
    setReceiveStep(2);
  };
  

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Welcome, User</h1>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} multiple />
              </label>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Files</h2>
            <ul className="space-y-4">
              {files.map(file => (
                <li key={file.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{file.size} • Uploaded on {file.uploadDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleShare(file.id)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {sharingFile && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-md">
                <h3 className="font-semibold mb-2">Share File</h3>
                <input
                  type="email"
                  placeholder="Enter recipient's email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                />
                <button
                  onClick={handleShareSubmit}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Share
                </button>
              </div>
            )}
          </section>
        </div>

        <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Receive Files</h2>
          {!isReceiving ? (
            <button
              onClick={() => setIsReceiving(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Access Shared Files
            </button>
          ) : (
            <div className="space-y-4">
              {receiveStep === 1 ? (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={receiveEmail}
                    onChange={(e) => setReceiveEmail(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Enter file name"
                    value={receiveFileName}
                    onChange={(e) => setReceiveFileName(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    onClick={handleReceiveNext}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter first security key"
                    value={securityKey1}
                    onChange={(e) => setSecurityKey1(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Enter second security key"
                    value={securityKey2}
                    onChange={(e) => setSecurityKey2(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    onClick={() => console.log('Accessing file...')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    Access File
                    <Download className="w-5 h-5 ml-2" />
                  </button>
                </>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

