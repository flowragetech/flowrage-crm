import { exec } from 'child_process';

export type ExecResult = {
  stdout: string;
  stderr: string;
};

export function execCommand(
  command: string,
  options: {
    cwd?: string;
    timeoutMs?: number;
  } = {}
) {
  return new Promise<ExecResult>((resolve, reject) => {
    exec(
      command,
      {
        cwd: options.cwd,
        timeout: options.timeoutMs,
        windowsHide: true,
        maxBuffer: 1024 * 1024 * 20
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(
            new Error(
              [error.message, stderr?.trim()].filter(Boolean).join('\n').trim()
            )
          );
          return;
        }

        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim()
        });
      }
    );
  });
}
