import cn from 'classnames';
import React, { useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

function CKEditorComp({ onChange, editorLoaded, name, value, label, className }: any) {
  /* const editorRef: any = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {
    CKEditor: null,
    ClassicEditor: null,
  };

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, // v3+
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
  }, []); */

  const editorConfiguration = {
    toolbar: {
      items: [
        'heading',
        '|',
        'alignment',
        '|',
        'fontBackgroundColor',
        'fontColor',
        'fontFamily',
        'highlight',
        'fontSize',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'subscript',
        'superscript',
        'link',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        '|',
        'Table',
        '|',
        'outdent',
        'indent',
        '|',
        'specialCharacters',
        '|',
        'Image',
        'ImageToolbar',
        'ImageCaption',
        'ImageStyle',
        'imageInsert',
        '|',
        'blockQuote',
        'mediaEmbed',
        '|',
        'undo',
        'redo',
        '|',
        'code',
      ],
      shouldNotGroupWhenFull: false,
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableCellProperties',
        'tableProperties',
      ],
    },
    link: {
      addTargetToExternalLinks: true,
    },
    image: {
      styles: ['alignLeft', 'alignCenter', 'alignRight', 'full', 'side'],
      resizeOptions: [
        {
          name: 'imageResize:original',
          value: null,
          icon: 'original',
        },
        {
          name: 'imageResize:50',
          value: '50',
          icon: 'medium',
        },
        {
          name: 'imageResize:75',
          value: '75',
          icon: 'large',
        },
      ],

      // You need to configure the image toolbar, too, so it shows the new style
      // buttons as well as the resize buttons.
      toolbar: [
        'imageStyle:alignLeft',
        'imageStyle:alignCenter',
        'imageStyle:alignRight',
        'imageStyle:full',
        'imageStyle:side',
        '|',
        'imageResize:50',
        'imageResize:75',
        'imageResize:original',
        '|',
        'imageTextAlternative',
        'linkImage',
      ],
    },
  };

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
          editor={Editor}
          config={editorConfiguration}
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

export default CKEditorComp;
