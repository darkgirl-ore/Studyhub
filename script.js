// ========== PRE-LOADED FILES ==========
const PRELOADED_FILES = [
    {
        id: 1,
        name: 'XML Basics.pdf',
        size: 245760,
        type: 'application/pdf',
        uploadDate: '2024-01-15T10:00:00.000Z',
        data: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKFRleHQgU2l6ZSBCYXNpY3MpCi9Qcm9kdWNlciAoU2tpYS9QREYgbWFrZXIgMjAxNy4wIFxTa2lhL1BERiBtYWtlciAyMDE3LjAgKFNraWEvUERGIG1ha2VyIDIwMTcuMCkpCi9DcmVhdGlvbkRhdGUgKEQ6MjAyNDAxMTUxMDAwMDArMDAnMDAnKQo+PgplbmRvYmoK'
    },
    {
        id: 2,
        name: 'Web Development Training Notes.pdf',
        size: 389120,
        type: 'application/pdf',
        uploadDate: '2024-01-15T10:30:00.000Z',
        data: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKFdlYiBEZXZlbG9wbWVudCBUcmFpbmluZyBOb3RlcykKL1Byb2R1Y2VyIChTa2lhL1BERiBtYWtlciAyMDE3LjAgXFNraWEvUERGIG1ha2VyIDIwMTcuMCAoU2tpYS9QREYgbWFrZXIgMjAxNy4wKSkKL0NyZWF0aW9uRGF0ZSAoRDoyMDI0MDExNTEwMzAwMCswMCcwMCcpCj4+CmVuZG9iag=='
    },
    {
        id: 3,
        name: 'JavaScript Introduction.pdf',
        size: 512000,
        type: 'application/pdf',
        uploadDate: '2024-01-15T11:00:00.000Z',
        data: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKEludHJvZHVjdGlvbiB0byBKYXZhU2NyaXB0KQovUHJvZHVjZXIgKFNraWEvUERGIG1ha2VyIDIwMTcuMCBcU2tpYS9QREYgbWFrZXIgMjAxNy4wIChTa2lhL1BERiBtYWtlciAyMDE3LjApKQovQ3JlYXRpb25EYXRlIChEOjIwMjQwMTE1MTEwMDAwKzAwJzAwJykKPj4KZW5kb2Jq'
    },
    {
        id: 4,
        name: 'jQuery Introduction.pdf',
        size: 356352,
        type: 'application/pdf',
        uploadDate: '2024-01-15T11:30:00.000Z',
        data: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKEludHJvZHVjdGlvbiB0byBqUXVlcnkpCi9Qcm9kdWNlciAoU2tpYS9QREYgbWFrZXIgMjAxNy4wIFxTa2lhL1BERiBtYWtlciAyMDE3LjAgKFNraWEvUERGIG1ha2VyIDIwMTcuMCkpCi9DcmVhdGlvbkRhdGUgKEQ6MjAyNDAxMTUxMTMwMDArMDAnMDAnKQo+PgplbmRvYmo='
    },
    {
        id: 5,
        name: 'Introduction to MySQL.pdf',
        size: 678912,
        type: 'application/pdf',
        uploadDate: '2024-01-15T12:00:00.000Z',
        data: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKEludHJvZHVjdGlvbiB0byBNeVNRTCkKL1Byb2R1Y2VyIChTa2lhL1BERiBtYWtlciAyMDE3LjAgXFNraWEvUERGIG1ha2VyIDIwMTcuMCAoU2tpYS9QREYgbWFrZXIgMjAxNy4wKSkKL0NyZWF0aW9uRGF0ZSAoRDoyMDI0MDExNTEyMDAwMCswMCcwMCcpCj4+CmVuZG9iag=='
    }
];

// ========== STATE ==========
let files = [];
let currentFileId = 6;

// ========== DOM ELEMENTS ==========
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatus = document.getElementById('uploadStatus');
const fileList = document.getElementById('fileList');
const fileCount = document.getElementById('fileCount');
const totalDocs = document.getElementById('totalDocs');
const storageCount = document.getElementById('storageCount');
const dropZone = document.getElementById('dropZone');
const refreshBtn = document.getElementById('refreshBtn');

// ========== INITIALIZATION ==========
function init() {
    loadFromStorage();
    renderFiles();
    
    uploadBtn.addEventListener('click', handleUpload);
    refreshBtn.addEventListener('click', refreshFiles);

    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            showStatus('info', `${files.length} file(s) selected. Click Upload to continue.`);
        }
    });

    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            showStatus('info', `${fileInput.files.length} file(s) selected. Click Upload to continue.`);
        }
    });
}

// ========== FILE MANAGEMENT ==========
function loadFromStorage() {
    try {
        const stored = localStorage.getItem('studyHubFiles');
        if (stored) {
            const parsed = JSON.parse(stored);
            files = parsed;
            if (files.length > 0) {
                currentFileId = Math.max(...files.map(f => f.id)) + 1;
            }
        } else {
            files = PRELOADED_FILES;
            currentFileId = Math.max(...files.map(f => f.id)) + 1;
            saveToStorage();
        }
    } catch (e) {
        console.error('Error loading files:', e);
        files = PRELOADED_FILES;
        currentFileId = Math.max(...files.map(f => f.id)) + 1;
        saveToStorage();
    }
}

function saveToStorage() {
    try {
        localStorage.setItem('studyHubFiles', JSON.stringify(files));
    } catch (e) {
        console.error('Error saving files:', e);
    }
}

function renderFiles() {
    const count = files.length;
    fileCount.textContent = `${count} document${count !== 1 ? 's' : ''}`;
    totalDocs.textContent = count;
    storageCount.textContent = `${count} files`;

    if (files.length === 0) {
        fileList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No documents available</p>
            </div>
        `;
        return;
    }

    fileList.innerHTML = files.map(file => `
        <div class="file-item" data-id="${file.id}">
            <div class="file-info">
                <i class="fas ${getFileIcon(file.type)}"></i>
                <div class="file-details">
                    <div class="file-name" title="${file.name}">${file.name}</div>
                    <div class="file-meta">
                        <span>${formatSize(file.size)}</span>
                        <span>${formatDate(file.uploadDate)}</span>
                    </div>
                </div>
            </div>
            <div class="file-actions">
                <button class="btn btn-success btn-small" onclick="downloadFile(${file.id})">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteFile(${file.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function refreshFiles() {
    loadFromStorage();
    renderFiles();
    showStatus('success', 'Files refreshed successfully!');
}

// ========== UPLOAD ==========
function handleUpload() {
    const filesToUpload = fileInput.files;
    
    if (filesToUpload.length === 0) {
        showStatus('error', 'Please select a file first.');
        return;
    }

    const file = filesToUpload[0];
    
    if (file.size > 20 * 1024 * 1024) {
        showStatus('error', 'File too large. Maximum size is 20MB.');
        return;
    }

    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

    const reader = new FileReader();
    reader.onload = function(e) {
        const fileData = {
            id: currentFileId++,
            name: file.name,
            size: file.size,
            type: file.type || 'application/octet-stream',
            data: e.target.result,
            uploadDate: new Date().toISOString()
        };

        files.push(fileData);
        saveToStorage();
        renderFiles();
        
        fileInput.value = '';
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Document';
        showStatus('success', 'File uploaded successfully!');
    };

    reader.onerror = function() {
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Document';
        showStatus('error', 'Error reading file. Please try again.');
    };

    reader.readAsDataURL(file);
}

// ========== DOWNLOAD ==========
function downloadFile(fileId) {
    const file = files.find(f => f.id === fileId);
    if (!file) {
        showStatus('error', 'File not found');
        return;
    }

    try {
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showStatus('success', `Downloading: ${file.name}`);
    } catch (e) {
        showStatus('error', 'Failed to download file');
    }
}

// ========== DELETE ==========
function deleteFile(fileId) {
    if (!confirm('Are you sure you want to delete this file?')) {
        return;
    }

    const index = files.findIndex(f => f.id === fileId);
    if (index === -1) {
        showStatus('error', 'File not found');
        return;
    }

    files.splice(index, 1);
    saveToStorage();
    renderFiles();
    showStatus('success', 'File deleted successfully!');
}

// ========== HELPERS ==========
function getFileIcon(mimeType) {
    if (!mimeType) return 'fa-file-pdf';
    if (mimeType.includes('pdf')) return 'fa-file-pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'fa-file-word';
    if (mimeType.includes('text')) return 'fa-file-alt';
    if (mimeType.includes('image')) return 'fa-file-image';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'fa-file-archive';
    return 'fa-file-pdf';
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showStatus(type, message) {
    uploadStatus.className = 'status-message ' + type;
    uploadStatus.textContent = message;
    uploadStatus.style.display = 'block';

    if (type !== 'info') {
        setTimeout(() => {
            uploadStatus.style.display = 'none';
        }, 5000);
    }
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', init);

// Make functions globally accessible
window.downloadFile = downloadFile;
window.deleteFile = deleteFile;