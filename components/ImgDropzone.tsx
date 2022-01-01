import styles from '../styles/module/pages/admin.module.scss';
import { useDropzone } from 'react-dropzone';

const ImgDropzone = (props: any) => {
  const { onDrop, data, isClear } = props;
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop: onDrop,
    accept: 'image/jpeg, image/png',
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps({
        className: isDragActive ? styles.active_drag_zone : styles.normal_drag_zone,
      })}
    >
      <input {...getInputProps()} name='thumbnail_data' />
      <p>Load the thumbnail image&apos;s path here.</p>

      <aside>
        <h4>Files</h4>
        <div>{data.thumbnail ? 'before:' + data.thumbnail : ''}</div>
        {!isClear ? (
          <>
            <ul>
              {acceptedFiles.map((file) => (
                <li key={file.name}>
                  current:{file.name} - {file.size} bytes <br />
                </li>
              ))}
            </ul>
          </>
        ) : (
          ''
        )}
      </aside>
    </div>
  );
};

export { ImgDropzone };
