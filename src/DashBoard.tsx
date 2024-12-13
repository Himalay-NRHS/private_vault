import React, { useState } from 'react';
import { Upload, Trash2, Share2, Download, ChevronRight } from 'lucide-react';
import sodium from "libsodium-wrappers";
import { form } from 'framer-motion/client';
import { type } from 'node:os';

interface File {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<File[]>([
    { id: '1', name: 'project_proposal.pdf', size: '2.3 MB', uploadDate: '2023-05-21' },
    { id: '2', name: 'financial_report.xlsx', size: '1.7 MB', uploadDate: '2023-05-20' },
    { id: '3', name: 'presentation.pptx', size: '5.1 MB', uploadDate: '2023-05-19' },
  ]);
  const [sharingFileId, setSharingFileId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [isReceiving, setIsReceiving] = useState(false);
  const [receiveStep, setReceiveStep] = useState(1);
  const [receiveEmail, setReceiveEmail] = useState('');
  const [receiveFileName, setReceiveFileName] = useState('');
  const [securityKey1, setSecurityKey1] = useState('');
  const [securityKey2, setSecurityKey2] = useState('');
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  const [downloadKey, setDownloadKey] = useState('');
const [fileExtention, setfileExtention] = useState('');
const [encryptedFileUrl, setEncryptedFileUrl] = useState<string | null>(null); 
const [keyHex, setKeyHex] = useState<string>(""); 
const [nonceHex, setNonceHex] = useState<string>(""); 


const encryptFile = async (file: any, fileExtension: string) => {
    await sodium.ready;
  
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const fileData = new Uint8Array(fileReader.result as ArrayBuffer);
  
      // Generate a random key and nonce
      const key = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
      const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  
      // Encrypt the file content
      const encryptedData = sodium.crypto_secretbox_easy(fileData, nonce, key);
     console.log(typeof encryptedData) 
  decryptFile(encryptedData, nonce, key);
      // Create a Blob from the encrypted data
      const blob = new Blob([encryptedData], { type: "application/octet-stream" });
  
      // Log the encrypted data, nonce, and key for debugging
      console.log("Encrypted data, nonce, key:", encryptedData, nonce, key);
  
      // Encrypt the file and generate the formData
      const formData = new FormData();
      formData.append("file", blob, `encryptedFile.${fileExtension}.bin`); // File name includes the original extension for clarity
  
      // Normally you'd send the formData to a backend here:
      // const response = await fetch('your-backend-endpoint', { method: 'POST', body: formData });
      // console.log(response);
  
      // For now, we just return the encrypted file details to handle it further
      console.log(formData);
    };
  
    fileReader.readAsArrayBuffer(file);
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    const file = event.target.files?.[0];
    if (file) {
      const fileName = file.name; 
      const fileExtension = fileName.split('.').pop()?.toLowerCase(); // Extracting the extension of the file
      const forbiddenExtensions = ["exe", "bat", "cmd", "sh", "msi", "com", "vbs"];
      if (event.target.files?.length > 1) {
        alert("You can only upload up to 1 files at a time.");
        return;
      }
      if (fileExtension && forbiddenExtensions.includes(fileExtension)) {
        alert("This file type is not allowed.");
        return;
      } else {
        console.log("Valid file uploaded:", file.name);
      }
      if (fileExtension) {
        console.log("File extension:", fileExtension);
        setfileExtention(fileExtension);
       encryptFile(file, fileExtension);

    } else {
        console.log("Could not determine file extension");
      }
    }
  };
  const decryptFile = async (encryptedData: Uint8Array, nonce: Uint8Array, key: Uint8Array) => {
    await sodium.ready;
  
    // Decrypt the file data
    const decryptedData = sodium.crypto_secretbox_open_easy(encryptedData, nonce, key);
    if (!decryptedData) {
      console.error("Decryption failed!");
      return null;
    }
  
    // Convert the decrypted binary data back to a Blob
    const blob = new Blob([decryptedData], { type: "application/octet-stream" });
  
    // Create a URL for the Blob to allow the user to download it
    const decryptedUrl = URL.createObjectURL(blob);
    console.log(decryptedUrl);
    // Return the decrypted file URL so it can be used for download
    return decryptedUrl;
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const handleShare = (id: string) => {
    setSharingFileId(id);
    setShareEmail('');
  };

  const handleShareSubmit = () => {
    console.log(`Sharing file ${sharingFileId} with ${shareEmail}`);
    setSharingFileId(null);
    setShareEmail('');
  };

  const handleDownload = (id: string) => {
    setDownloadingFileId(id);
    setDownloadKey('');
  };

  const handleDownloadSubmit = () => {
    console.log(`Downloading file ${downloadingFileId} with key ${downloadKey}`);
    // Here you would implement the actual download logic
    setDownloadingFileId(null);
    setDownloadKey('');
  };

  const handleReceiveNext = () => {
    setReceiveStep(2);
  };

  const handleReceiveFile = () => {
    console.log('Receiving file:', { receiveEmail, receiveFileName, securityKey1, securityKey2 });
    setIsReceiving(false);
    setReceiveStep(1);
    setReceiveEmail('');
    setReceiveFileName('');
    setSecurityKey1('');
    setSecurityKey2('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Welcome, John Doe</h1>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-indigo-300 border-dashed rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-indigo-500" />
                  <p className="mb-2 text-sm text-indigo-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-indigo-500">Any file type (MAX. 100MB)</p>
                </div>
                <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} multiple />
              </label>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Your Files</h2>
            <ul className="space-y-4">
              {files.map(file => (
                <li key={file.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                  <div>
                    <p className="font-medium text-indigo-600">{file.name}</p>
                    <p className="text-sm text-gray-500">{file.size} • Uploaded on {file.uploadDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(file.id)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                      aria-label="Download file"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleShare(file.id)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                      aria-label="Share file"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                      aria-label="Delete file"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {sharingFileId && (
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
            {downloadingFileId && (
              <div className="mt-4 p-4 bg-green-50 rounded-md">
                <h3 className="font-semibold mb-2">Download File</h3>
                <input
                  type="text"
                  placeholder="Enter decryption key"
                  value={downloadKey}
                  onChange={(e) => setDownloadKey(e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                />
                <button
                  onClick={handleDownloadSubmit}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  OK
                </button>
              </div>
            )}
          </section>
        </div>

        <section className="mt-8 bg-white p-6 rounded-lg shadow-lg">
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
                    onClick={handleReceiveFile}
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
?      </main>
    </div>
  );
};

export default Dashboard;

