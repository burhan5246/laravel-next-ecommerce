import cn from 'classnames';
import React, { useEffect, useRef } from 'react';

function CKEditor({ onChange, editorLoaded, name, value, label, className }: any) {
  const editorRef: any = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {
    CKEditor: null,
    ClassicEditor: null,
  };

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, // v3+
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
  }, []);

  return (
    <div className={className}>
        {label && (
        <label className="block text-body-dark font-semibold text-sm leading-none mb-3">
          {label}
        </label>
      )}
      {editorLoaded ? (
        <CKEditor
          type=""
          name={name}
          editor={ClassicEditor}
          data={value}
          onChange={(event: any, editor: any) => {
            const data = editor.getData();
            // console.log({ event, editor, data })
            onChange(data);
          }}
        />
      ) : (
        <div>Editor loading</div>
      )}
    </div>
  );
}

export default CKEditor;
