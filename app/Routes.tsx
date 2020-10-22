/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/button-has-type */
/* eslint react/jsx-props-no-spreading: off */
import React, { useState, useEffect } from 'react';
import { execSync } from 'child_process';

const getFiles = (): string[] => {
  const files = localStorage.getItem('files');
  if (files) {
    return JSON.parse(files);
  }
  return [];
};

export default function Routes() {
  const [files, setfiles] = useState<string[]>(getFiles());
  const [output, setoutput] = useState('');
  const [command, setCommand] = useState('');
  const [success, setsuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('files', JSON.stringify(files));
  }, [files]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <label htmlFor="file" style={{ margin: '20px auto' }}>
        Pick a js file
        <br />
        <input
          id="file"
          type="file"
          // value="Pick a js file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            try {
              const path: string | null =
                e.target.files &&
                e.target.files[e.target.files.length - 1] &&
                e.target.files[e.target.files.length - 1].path;

              if (path && files.indexOf(path) === -1) {
                setfiles([...files, path]);
              }
            } catch (error) {
              console.error('------------error------------', error);
            }
          }}
          accept=".js"
        />
      </label>
      <br />
      {files.map((filePath) => {
        const filename = filePath.replace(/^.*[\\\/]/, '');
        return (
          <button
            key={`${filePath}`}
            style={{ margin: 10 }}
            onClick={() => {
              const script = `node ${filePath}`;
              try {
                const log = execSync(script).toString();
                setsuccess(true);
                setoutput(log);
              } catch (error) {
                setsuccess(false);
                setoutput(error.message);
              }
              setCommand(script);
            }}
          >
            Run {filename}
          </button>
        );
      })}
      {output && (
        <div
          style={{
            backgroundColor: '#000',
            color: '#fff',
            position: 'fixed',
            height: '50vh',
            width: '100vw',
            bottom: 0,
          }}
        >
          <h3>Script ran {success ? 'successfuly' : 'with errors'}</h3>
          <h4 style={{ textDecoration: 'underline' }}>Command: {command}</h4>
          <h4 style={{ textDecoration: 'underline' }}>Output:</h4>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
}
