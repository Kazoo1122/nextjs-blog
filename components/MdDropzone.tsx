import styles from '../styles/module/pages/admin.module.scss';
import { useDropzone } from 'react-dropzone';

/**
 * 記事投稿画面で使用しているマークダウン書式アップロード用ドロップゾーン
 * @param props
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MdDropzone = (props: any) => {
  const { onDrop, isClear } = props;
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop: onDrop,
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
