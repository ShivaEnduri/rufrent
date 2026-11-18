import React, { useState } from "react";
import { studioTailwindStyles } from '../../../utils/studioTailwindStyles';

const VendorCompleteTaskForm = ({ task, onSubmit, onCancel }) => {
  const [beforeImages, setBeforeImages] = useState([]);
  const [afterImages, setAfterImages] = useState([]);
  const [beforeVideos, setBeforeVideos] = useState([]);
  const [afterVideos, setAfterVideos] = useState([]);
  const [notes, setNotes] = useState("");
  const [warning, setWarning] = useState("");

  const maxImages = 5;
  const maxVideos = 2;

  const handleImageChange = (e, setImages, currentImages) => {
    const files = Array.from(e.target.files);
    if (currentImages.length + files.length > maxImages) {
      setWarning(`You can upload a maximum of ${maxImages} images.`);
      e.target.value = null; // Clear the input
      return;
    }
    setWarning("");
    setImages([...currentImages, ...files]);
  };

  const handleVideoChange = (e, setVideos, currentVideos) => {
    const files = Array.from(e.target.files);
    if (currentVideos.length + files.length > maxVideos) {
      setWarning(`You can upload a maximum of ${maxVideos} videos.`);
      e.target.value = null; // Clear the input
      return;
    }
    setWarning("");
    setVideos([...currentVideos, ...files]);
  };

  const removeFile = (index, setFiles, currentFiles) => {
    setFiles(currentFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (beforeImages.length === 0 || afterImages.length === 0 || !notes.trim()) {
      setWarning("Please upload at least one Before Image, one After Image, and provide notes.");
      return;
    }
    setWarning("");
    onSubmit({
      sub_task_description: notes,
      beforeImages,
      afterImages,
      beforeVideos,
      afterVideos,
    });
    onCancel();
  };

  return (
    <div>
      <h3 className={studioTailwindStyles.form_heading}>Complete Subtask: {task.sub_task_name}</h3>
      {warning && (
        <p className={`${studioTailwindStyles.form_text} text-red-500 font-medium`} aria-live="assertive">
          {warning}
        </p>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={studioTailwindStyles.form_label}>Before Images (Up to {maxImages})</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageChange(e, setBeforeImages, beforeImages)}
            className={`${studioTailwindStyles.form_text} w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 form-input focus:ring-2 focus:ring-accent mt-1`}
            aria-label="Upload Before Images"
          />
          <div className="mt-2">
            {beforeImages.map((file, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className={studioTailwindStyles.form_text}>{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index, setBeforeImages, beforeImages)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove ${file.name}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className={studioTailwindStyles.form_label}>After Images (Up to {maxImages})</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageChange(e, setAfterImages, afterImages)}
            className={`${studioTailwindStyles.form_text} w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 form-input focus:ring-2 focus:ring-accent mt-1`}
            aria-label="Upload After Images"
          />
          <div className="mt-2">
            {afterImages.map((file, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className={studioTailwindStyles.form_text}>{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index, setAfterImages, afterImages)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove ${file.name}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className={studioTailwindStyles.form_label}>Before Videos (Up to {maxVideos})</label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => handleVideoChange(e, setBeforeVideos, beforeVideos)}
            className={`${studioTailwindStyles.form_text} w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 form-input focus:ring-2 focus:ring-accent mt-1`}
            aria-label="Upload Before Videos"
          />
          <div className="mt-2">
            {beforeVideos.map((file, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className={studioTailwindStyles.form_text}>{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index, setBeforeVideos, beforeVideos)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove ${file.name}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className={studioTailwindStyles.form_label}>After Videos (Up to {maxVideos})</label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => handleVideoChange(e, setAfterVideos, afterVideos)}
            className={`${studioTailwindStyles.form_text} w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 form-input focus:ring-2 focus:ring-accent mt-1`}
            aria-label="Upload After Videos"
          />
          <div className="mt-2">
            {afterVideos.map((file, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className={studioTailwindStyles.form_text}>{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index, setAfterVideos, afterVideos)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove ${file.name}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-full">
          <label className={studioTailwindStyles.form_label}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`${studioTailwindStyles.form_text} w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 form-input focus:ring-2 focus:ring-accent mt-1`}
            rows="4"
            required
            aria-label="Task Notes"
          />
        </div>
        <div className="col-span-full mt-4 flex space-x-4">
          <button
            type="submit"
            className={studioTailwindStyles.form_main_button}
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={studioTailwindStyles.form_secondary_button}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorCompleteTaskForm;