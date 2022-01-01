import styles from '../styles/module/pages/admin.module.scss';
import { useDropzone } from 'react-dropzone';

const MdDropzone = (props: any) => {
  const { onDropText, isClear } = props;
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop: onDropText,
    accept: '.md',
  });

  return (
    <div
      {...getRootProps({
        className: isDragActive ? styles.active_drag_zone : styles.normal_drag_zone,
      })}
    >
      <input {...getInputProps()} />
      <p>Load the &quot;.md&quot; file containing the text of the blog body here.</p>
      <aside>
        <h4>Files</h4>
        {!isClear ? (
          <>
            <ul>
              {acceptedFiles.map((file) => (
                <li key={file.name}>
                  {file.name} - {file.size} bytes <br />
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

export { MdDropzone };
