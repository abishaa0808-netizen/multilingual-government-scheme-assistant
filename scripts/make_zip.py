import os
import zipfile

IGNORED_DIRS = {'node_modules', '.git', 'dist', '.aistudio'}
IGNORED_FILES = {'project.zip'}

def zip_project(output_path):
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk('.'):
            # Prune ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
            
            for file in files:
                if file in IGNORED_FILES:
                    continue
                file_path = os.path.join(root, file)
                archive_name = os.path.relpath(file_path, '.')
                z.write(file_path, archive_name)

if __name__ == '__main__':
    zip_project('project.zip')
    # Copy to public/project.zip
    import shutil
    shutil.copyfile('project.zip', 'public/project.zip')
    print('Project zip updated successfully!')
