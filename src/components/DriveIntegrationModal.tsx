"use client";

import { useState } from "react";
import { Folder, HardDrive, CheckCircle2, ExternalLink, RefreshCw, X } from "lucide-react";

interface DriveIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  formTitle: string;
  currentDriveFolderUrl?: string | null;
  onSaveDriveFolder: (url: string) => void;
}

export function DriveIntegrationModal({
  isOpen,
  onClose,
  formTitle,
  currentDriveFolderUrl,
  onSaveDriveFolder,
}: DriveIntegrationModalProps) {
  const [folderUrl, setFolderUrl] = useState(
    currentDriveFolderUrl || `https://drive.google.com/drive/folders/demo_${formTitle.replace(/[^a-zA-Z0-9]/g, "_")}`
  );
  const [isConnected, setIsConnected] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Google Drive Cloud Response Sync</h3>
              <p className="text-xs text-slate-500">Auto-push file uploads & responses to your Google Drive</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Google Drive OAuth Connected</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Account: demo.creator@gmail.com</p>
              </div>
            </div>
            <button
              onClick={() => setIsConnected(!isConnected)}
              className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Re-authenticate
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Folder className="h-3.5 w-3.5 text-blue-600" /> Target Google Drive Folder URL
            </label>
            <input
              type="text"
              value={folderUrl}
              onChange={(e) => setFolderUrl(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Uploaded files will automatically sync into formatted subfolders: <code className="text-emerald-600 font-mono">RespondentName_Timestamp_Filename</code>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <a
            href={folderUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            Open Folder in Drive <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSaveDriveFolder(folderUrl);
                onClose();
              }}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm"
            >
              Save Sync Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
